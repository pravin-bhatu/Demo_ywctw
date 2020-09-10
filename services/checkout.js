const Parse = require('../modules/parse.js');
const moment = require('moment');
const VoucherModel = Parse.Object.extend('VoucherDetails');
const EnrollmentModel = Parse.Object.extend('Enrollment');


class CheckoutService {

    static mwgetVoucherValid = (req,res,next)=>{
        console.log(req.body.Vouchercode);
        console.log(req.body.courseid);
		const vouchercode = new Parse.Query(VoucherModel);
        vouchercode.equalTo('VoucherCode',req.body.Vouchercode);
        vouchercode.equalTo('courseId',req.body.courseid);		
		vouchercode.first().then(v =>{
              
               if(v == undefined){
                   console.log('error');
                   res.data.errormessage='Voucher code is Invalid';
                   return next();
               }else{

                var exdate = v.get('Expirydate');
                var matchdate = moment(exdate).format('YYYY/MM/DD');
                const current_date= moment().format('YYYY/MM/DD');

                if(current_date > matchdate){
                    console.log('coupon expired');
                    res.data.voucherstatus='CouponExpired';
                    return next();
                }
                else{

                        /** code for checking voucher is redeem or not  */
                const Vouchercode = new Parse.Query(VoucherModel);
                Vouchercode.equalTo('VoucherCode',req.body.Vouchercode);
                //Vouchercode.equalTo('Status','Redeem');	
                Vouchercode.equalTo('courseId',req.body.courseid);
                Vouchercode.first().then(v =>{	
                    console.log(v.get('Status'));	
                    if(v.get('Status')=='Redeem'){
                        res.data.voucherstatus='Redeem';                        
                        return next();
                    }else {
                        console.log('Updating voucher table and add data in enrollment table');
                        const username=res.data.user.user_metadata.firstName+ '  ' +res.data.user.user_metadata.lastName;

                        console.log('Promocode'+req.body.Vouchercode);
                        console.log('User Email'+res.data.user.email);
                        console.log('User Name'+username);
                       // return next();

                       const query = new Parse.Query(VoucherModel);		
                       query.equalTo('VoucherCode',req.body.Vouchercode);				
                       query.first().then(voucher=>{
                          voucher.set('Redeem_by',username);
                          voucher.set('Status','Redeem');
                          voucher.set('EmailId',res.data.user.email);
                          voucher.save().then(saved =>{                             
                              return next();
                          });
                          //return next();
                       });

                       
                      console.log('data inserted in enrollment table !');
                      console.log(req.body.courseid);
                      console.log(res.data.user.user_id);

                       /** query to add the course into enrollment **/
                        const enroll = {
                            course: {"__type": "Pointer", "className": "Course", "objectId": req.body.courseid},
                            userId: res.data.user.user_id,
                            completed: [],
                        }
                        
                        const enrollment = new EnrollmentModel();
                        enrollment.save(enroll);
                        console.log('Course is Added Successfully!');
                        return next();
                    }
                   // return next();
                });
                    
                }

                  
                	                
               }           
;                 
		});			
	}		
}

module.exports = CheckoutService;