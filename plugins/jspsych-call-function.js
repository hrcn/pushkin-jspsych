/**
 * jspsych-call-function
 * plugin for calling an arbitrary function during a jspsych experiment
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 **/
const callFunction = (function() {

  var plugin = {};

  plugin.info = {
    name: 'call-function',
    description: '',
    parameters: {
      func: {
        type: 'FUNCTION',
        pretty_name: 'Function',
        default: undefined,
        description: 'Function to call'
      },
      async: {
        type: 'BOOL',
        pretty_name: 'Asynchronous',
        default: false,
        description: 'Is the function call asynchronous?'
      }
    }
  }

  plugin.trial = function(jsPsych, trial) {
    trial.post_trial_gap = 0;
    var return_val;
    var display_element = jsPsych.getDisplayElement();

    if(trial.async){
      var done = function(data){
        return_val = data;
        end_trial();    
      }
      trial.func(done);
    } else {
      return_val = trial.func();
      end_trial();
    }
    
    function end_trial(){
      var trial_data = {
        value: return_val
      };
  
      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();

export default callFunction;