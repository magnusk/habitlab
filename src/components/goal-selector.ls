{cfy} = require 'cfy'
prelude = require 'prelude-ls'
$ = require 'jquery'

swal = require 'sweetalert2'

{load_css_file} = require 'libs_common/content_script_utils'

{
  get_enabled_goals
  get_goals
  set_goal_target
  get_goal_target
  remove_custom_goal_and_generated_interventions
  add_enable_custom_goal_reduce_time_on_domain
  set_goal_enabled_manual
  set_goal_disabled_manual
} = require 'libs_backend/goal_utils'

{
  get_interventions
  get_enabled_interventions
  set_intervention_disabled
} = require 'libs_backend/intervention_utils'


{
  enable_interventions_because_goal_was_enabled
} = require 'libs_backend/intervention_manager'

{
  add_log_interventions
} = require 'libs_backend/log_utils'


{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  get_canonical_domain
} = require 'libs_backend/canonical_url_utils'

{polymer_ext} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'goal-selector'
  properties: {
    sites_and_goals: {
      type: Array
      value: []
    }
    daily_goal_values: {
      type: Array
      value: ["5 minutes", "10 minutes", "15 minutes", "20 minutes", "25 minutes", "30 minutes", "35 minutes", "40 minutes", "45 minutes", "50 minutes", "55 minutes", "60 minutes"]
    }
    index_of_daily_goal_mins: {
      type: Object
      value: {}
    },
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
  }
  isdemo_changed: (isdemo) ->
    if isdemo
      this.set_sites_and_goals()
  delete_goal_clicked: cfy (evt) ->*
    goal_name = evt.target.goal_name
    yield remove_custom_goal_and_generated_interventions goal_name
    yield this.set_sites_and_goals()
    this.fire 'need_rerender', {}
  disable_interventions_which_do_not_satisfy_any_goals: cfy (goal_name) ->*
    enabled_goals = yield get_enabled_goals()
    enabled_interventions = yield get_enabled_interventions()
    all_interventions = yield get_interventions()
    interventions_to_disable = []
    for intervention_name,intervention_enabled of enabled_interventions
      if not intervention_enabled
        continue
      intervention_info = all_interventions[intervention_name]
      intervention_satisfies_an_enabled_goal = false
      for goal_info in intervention_info.goals
        if enabled_goals[goal_info.name]
          intervention_satisfies_an_enabled_goal = true
      if not intervention_satisfies_an_enabled_goal
        interventions_to_disable.push intervention_name
    prev_enabled_interventions = {} <<< enabled_interventions
    for intervention_name in interventions_to_disable
      yield set_intervention_disabled intervention_name
    if interventions_to_disable.length > 0
      add_log_interventions {
        type: 'interventions_disabled_due_to_user_disabling_goal'
        manual: false
        goal_name: goal_name
        interventions_list: interventions_to_disable
        prev_enabled_interventions: prev_enabled_interventions
      }
  time_updated: cfy (evt, obj) ->*
    mins = Number (obj.item.innerText.trim ' ' .split ' ' .0)
    set_goal_target obj.item.class, mins
  get_daily_targets: cfy ->*
    goals = yield get_goals!
    for goal in Object.keys goals
      if goal == "debug/all_interventions" 
        continue
      mins = yield get_goal_target goal
      mins = mins/5 - 1
      this.index_of_daily_goal_mins[goal] = mins
  show_internal_names_of_goals: ->
    return localStorage.getItem('intervention_view_show_internal_names') == 'true'
  set_sites_and_goals: cfy ->*
    self = this
    goal_name_to_info = yield get_goals()
    sitename_to_goals = {}
    for goal_name,goal_info of goal_name_to_info
      if goal_name == 'debug/all_interventions' and localStorage.getItem('intervention_view_show_debug_all_interventions_goal') != 'true'
        continue
      sitename = goal_info.sitename
      if not sitename_to_goals[sitename]?
        sitename_to_goals[sitename] = []
      sitename_to_goals[sitename].push goal_info
    list_of_sites_and_goals = []
    list_of_sites = prelude.sort Object.keys(sitename_to_goals)
    enabled_goals = yield get_enabled_goals()
    yield this.get_daily_targets!
    
    for sitename in list_of_sites
      current_item = {sitename: sitename}
      current_item.goals = prelude.sort-by (.name), sitename_to_goals[sitename]
      
      for goal in current_item.goals
        goal.enabled = (enabled_goals[goal.name] == true)
        goal.number = this.index_of_daily_goal_mins[goal.name]

      list_of_sites_and_goals.push current_item
    self.sites_and_goals = list_of_sites_and_goals
  goal_changed: cfy (evt) ->*
    
    checked = evt.target.checked
    
    goal_name = evt.target.goal.name


    self = this
    if checked
      yield set_goal_enabled_manual goal_name
      
      check_if_first_goal = cfy ->*       
        if !localStorage.first_goal?
          localStorage.first_goal = 'has enabled a goal before'
          #add_toolbar_notification!

          # yield load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
          # try
          #   yield swal {
          #     title: 'You set a goal!'
          #     text: 'HabitLab will use its algorithms to try different interventions on your webpages, and intelligently figure out what works best for you. You can manually tinker with settings if you\'d like.'
          #     type: 'success'
          #     confirmButtonText: 'See it in action'
          #   }
            
          #   set_override_enabled_interventions_once('facebook/show_user_info_interstitial')
          #   all_goals = yield get_goals()
          #   goal_info = all_goals[goal_name]
          #   chrome.tabs.create {url: goal_info.homepage }
          # catch
          #   console.log 'failure'
      check_if_first_goal!
    else
      
      yield set_goal_disabled_manual goal_name
    yield this.disable_interventions_which_do_not_satisfy_any_goals(goal_name)
    if checked
      yield enable_interventions_because_goal_was_enabled(goal_name)
    
    yield self.set_sites_and_goals()
    self.fire 'goal_changed', {goal_name: goal_name}
  sort_custom_sites_after: (sites_and_goals) ->
    [custom_sites_and_goals,normal_sites_and_goals] = prelude.partition (-> it.goals.filter((.custom)).length > 0), sites_and_goals
    return normal_sites_and_goals.concat custom_sites_and_goals
  add_goal_clicked: (evt) ->
    this.add_custom_website_from_input()
    return
  add_website_input_keydown: (evt) ->
    if evt.keyCode == 13
      # enter pressed
      this.add_custom_website_from_input()
      return
  add_custom_website_from_input: cfy ->*
    domain = url_to_domain(this.$$('#add_website_input').value.trim())
    if domain.length == 0
      return
    this.$$('#add_website_input').value = ''
    canonical_domain = yield get_canonical_domain(domain)
    if not canonical_domain?
      swal {
        title: 'Invalid Domain'
        html: $('<div>').append([
          $('<div>').text('You entered an invalid domain: ' + domain)
          $('<div>').text('Please enter a valid domain such as www.amazon.com')
        ])
        type: 'error'
      }
      return
    yield add_enable_custom_goal_reduce_time_on_domain(canonical_domain)
    yield this.set_sites_and_goals()
    this.fire 'need_rerender', {}
    return
  ready: cfy ->*
    load_css_file('bower_components/sweetalert2/dist/sweetalert2.css')
}
