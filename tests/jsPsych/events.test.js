const utils = require('../testing-utils.js');

import jsPsych from '../../jspsych.js';
import '../../plugins/jspsych-html-keyboard-response.js';
import '../../plugins/jspsych-html-slider-response.js';

// beforeEach(function(){
//   require('../../jspsych.js');
//   require('../../plugins/jspsych-html-keyboard-response.js');
// })

describe('on_finish (trial)', function(){
  test('should get an object of data generated by the trial', function(){

    return (new Promise(function(resolve, reject){

      var key_data = null;

      var trial = {
        type: 'html-keyboard-response',
        stimulus: 'hello',
        on_finish: function(data){
          key_data = data.key_press;
        }
      }

      jsPsych.init({
        timeline: [trial],
        on_finish: function() {
          resolve({key_data});
        }
      });

      utils.pressKey(32);

    })).then(function(data) { expect(data.key_data).toBe(32) });
  });

  test('should be able to write to the data', function(){

    return (new Promise(function(resolve, reject){

      var promise_data = {};

      var trial = {
        type: 'html-keyboard-response',
        stimulus: 'hello',
        on_finish: function(data){
          data.key_press = 1;
        }
      }

      jsPsych.init({
        timeline: [trial],
        on_finish: function() {
          promise_data.final_key_press = jsPsych.data.get().values()[0].key_press;
          resolve(promise_data);
        }
      });

      utils.pressKey(32);

      //resolve();
    })).then(function(pd) {
      expect(pd.final_key_press).toBe(1);
    });
  });
});

describe('on_start (trial)', function(){

  test('should get trial data with function parameters evaluated', function(){
    
    return (new Promise(function(resolve, reject){

      var d = null;

      var trial = {
        type: 'html-keyboard-response',
        stimulus: function(){ return 'hello'; },
        on_start: function(trial){
          d = trial.stimulus;
        }
      }

      jsPsych.init({
        timeline: [trial],
        on_finish: function() {
          resolve(d);
        }
      });

      utils.pressKey(32);

    })).then(function(data) { expect(data).toBe('hello') });
  });

  test('should get trial data with timeline variables evaluated', function(){
    
    return (new Promise(function(resolve, reject){

      var d = null;

      var trial = {
        timeline: [{
          type: 'html-keyboard-response',
          stimulus: jsPsych.timelineVariable('stimulus'),
          on_start: function(trial){
            d = trial.stimulus;
          }
        }],
        timeline_variables: [{stimulus: 'hello'}]
      }

      jsPsych.init({
        timeline: [trial],
        on_finish: function() {
          resolve(d);
        }
      });

      utils.pressKey(32);

    })).then(function(data) { expect(data).toBe('hello') });
  });
})

describe('on_trial_finish (experiment level)', function(){
  test('should get an object containing the trial data', function(){
    
    return (new Promise(function(resolve, reject){

      var promise_data = {};

      var trial = {
        type: 'html-keyboard-response',
        stimulus: 'hello'
      }

      jsPsych.init({
        timeline: [trial],
        on_trial_finish: function(data){
          promise_data.key = data.key_press;
        },
        on_finish: function(){
          resolve(promise_data);
        }
      });

      utils.pressKey(32);

      //resolve();
    })).then(function(pd) {
      expect(pd.key).toBe(32);
    });
  });

  test('should allow writing to the data object', function(){
    
    return (new Promise(function(resolve, reject){

      var promise_data = {};

      var trial = {
        type: 'html-keyboard-response',
        stimulus: 'hello'
      }

      jsPsych.init({
        timeline: [trial],
        on_trial_finish: function(data){
          data.write = true;
        },
        on_finish: function(data){
          promise_data.write = data.values()[0].write;
          resolve(promise_data);
        }
      });

      utils.pressKey(32);

      //resolve();
    })).then(function(pd) {
      expect(pd.write).toBe(true);
    });
  });
});

describe('on_data_update', function(){
  test('should get an object containing the trial data', function(){
    
    return (new Promise(function(resolve, reject){

      var promise_data = {};

      var trial = {
        type: 'html-keyboard-response',
        stimulus: 'hello'
      }

      jsPsych.init({
        timeline: [trial],
        on_data_update: function(data){
          promise_data.key = data.key_press;
        },
        on_finish: function(){
          resolve(promise_data);
        }
      });

      utils.pressKey(32);

      //resolve();
    })).then(function(pd) {
      expect(pd.key).toBe(32);
    });
  });

  test('should contain data with null values', function(){

    // require('../../plugins/jspsych-html-slider-response.js');
    
    return (new Promise(function(resolve, reject){

      var promise_data = [];

      var trial = {
        type: 'html-keyboard-response',
        stimulus: 'hello',
        trial_duration: 10
      }

      var trial_2 = {
        type: 'html-slider-response',
        stimulus: 'hello',
        trial_duration: 10
      }

      jsPsych.init({
        timeline: [trial, trial_2],
        on_data_update: function(data){
          promise_data.push(data);
        },
        on_finish: function(){
          resolve(promise_data);
        }
      });

      //resolve();
    })).then(function(pd) {
      expect(pd[0].key_press).not.toBeUndefined();
      expect(pd[0].key_press).toBeNull();
      expect(pd[1].response).toBeNull();
      expect(pd[1].rt).toBeNull();
    });
  });

  test('should contain data added with on_finish (trial level)', function(){
    
    return (new Promise(function(resolve, reject){

      var promise_data = {};

      var trial = {
        type: 'html-keyboard-response',
        stimulus: 'hello',
        on_finish: function(data){
          data.trial_level = true;
        }
      }

      jsPsych.init({
        timeline: [trial],
        on_data_update: function(data){
          promise_data.trial_level = data.trial_level;
        },
        on_finish: function(){
          resolve(promise_data);
        }
      });

      utils.pressKey(32);

      //resolve();
    })).then(function(pd) {
      expect(pd.trial_level).toBe(true);
    });
  });

  test('should contain data added with on_trial_finish (experiment level)', function(){
    
    return (new Promise(function(resolve, reject){

      var promise_data = {};

      var trial = {
        type: 'html-keyboard-response',
        stimulus: 'hello'
      }

      jsPsych.init({
        timeline: [trial],
        on_trial_finish: function(data){
          data.experiment_level = true;
        },
        on_data_update: function(data){
          promise_data.experiment_level = data.experiment_level;
        },
        on_finish: function(){
          resolve(promise_data);
        }
      });

      utils.pressKey(32);

      //resolve();
    })).then(function(pd) {
      expect(pd.experiment_level).toBe(true);
    });
  });
});

describe('on_trial_start', function(){

  test('should get an object containing the trial properties', function(){
    
    return (new Promise(function(resolve, reject){

      var promise_data = {};

      var trial = {
        type: 'html-keyboard-response',
        stimulus: 'hello'
      }

      jsPsych.init({
        timeline: [trial],
        on_trial_start: function(trial){
          promise_data.text = trial.stimulus;
        },
        on_finish: function(){
          resolve(promise_data);
        }
      });

      utils.pressKey(32);

      //resolve();
    })).then(function(pd) {
      expect(pd.text).toBe('hello');
    });
  });

  test('should allow modification of the trial properties', function(){
    
    var trial = {
      type: 'html-keyboard-response',
      stimulus: 'hello'
    }

    jsPsych.init({
      timeline: [trial],
      on_trial_start: function(trial){
        trial.stimulus = 'goodbye';
      }
    });

    var display_element = jsPsych.getDisplayElement();
    expect(display_element.innerHTML).toMatch('goodbye');

    utils.pressKey(32);
  });
});
