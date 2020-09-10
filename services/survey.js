class SurveyService {
  static mwSesSurvey(req, res, next) {

    console.log('In mwSesSurvey');

    const surveyAnswers = {};

    // set main reasons
    let mainReason = []
    if (req.body.growthDevelopment) {
      mainReason.push('growthDevelopment');
    }
    if (req.body.becomeMentor) {
      mainReason.push('becomeMentor');
    }
    if (req.body.networking) {
      mainReason.push('networking');
    }
    if (req.body.speakers) {
      mainReason.push('speakers');
    }
    if (req.body.other) {
      mainReason.push('other');
    }
    if (req.body.otherInput) {
      mainReason.push('otherInput');
    }

    console.log(mainReason);
    surveyAnswers.reasons = mainReason;

    res.data.survey = surveyAnswers;
    return next();

  }
}

module.exports = SurveyService;