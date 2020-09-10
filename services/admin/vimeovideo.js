
class VimeoService {
	static mwVideoUploadVimeo(req, res, next) {
		let Vimeo = require('vimeo').Vimeo;
		let client = new Vimeo("{3e500b37fc4e449241967671e9daad2a04c4c5ec}", "{GzjfIvJRDlGWHPbSFm4x7f/R649I5f0XU0um5/UpVZZ5sTnpuke3kK4YhxDI9T/dh2pjS8d6C7Vx76XOWv7rkOavkqLu3r9sfCA1YwcIAZN7EepoFVcVRn3CtYDNYkeF}", "854b0494adda21ff42971d5b40a91e42");
		res.data.client = client;
		return next();
	}
}

module.exports = VimeoService;