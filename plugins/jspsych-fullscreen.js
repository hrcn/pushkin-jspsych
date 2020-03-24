/* jspsych-fullscreen.js
 * Josh de Leeuw
 *
 * toggle fullscreen mode in the browser
 *
 */
const jspsychFullscreen = (function() {

  var plugin = {};

  plugin.info = {
    name: 'fullscreen',
    description: '',
    parameters: {
      fullscreen_mode: {
        type: 'BOOL',
        pretty_name: 'Fullscreen mode',
        default: true,
        array: false,
        description: 'If true, experiment will enter fullscreen mode. If false, the browser will exit fullscreen mode.'
      },
      message: {
        type: 'STRING',
        pretty_name: 'Message',
        default: '<p>The experiment will switch to full screen mode when you press the button below</p>',
        array: false,
        description: 'HTML content to display above the button to enter fullscreen mode.'
      },
      button_label: {
        type: 'STRING',
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'The text that appears on the button to enter fullscreen.'
      },
      delay_after: {
        type: 'INT',
        pretty_name: 'Delay after',
        default: 1000,
        array: false,
        description: 'The length of time to delay after entering fullscreen mode before ending the trial.'
      },
    }
  }

  plugin.trial = function(jsPsych, trial) {

    var display_element = jsPsych.getDisplayElement();

    // check if keys are allowed in fullscreen mode
    var keyboardNotAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
    if (keyboardNotAllowed) {
      // This is Safari, and keyboard events will be disabled. Don't allow fullscreen here.
      // do something else?
      endTrial();
    } else {
      if(trial.fullscreen_mode){
        display_element.innerHTML = trial.message + '<button id="jspsych-fullscreen-btn" class="jspsych-btn">'+trial.button_label+'</button>';
        var listener = display_element.querySelector('#jspsych-fullscreen-btn').addEventListener('click', function() {
          var element = document.documentElement;
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
          endTrial();
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        endTrial();
      }
    }

    function endTrial() {

      display_element.innerHTML = '';

      jsPsych.pluginAPI.setTimeout(function(){

        var trial_data = {
          success: !keyboardNotAllowed
        };

        jsPsych.finishTrial(trial_data);

      }, trial.delay_after);

    }

  };

  return plugin;
})();

export default jspsychFullscreen;