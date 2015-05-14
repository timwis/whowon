var ENDPOINT = 'https://www.kimonolabs.com/api/ondemand/bu47bvtc?apikey=e63bed3705c2516f72f7fdff47beac5a&kimmodify=1',
  INTERVAL = 10000;
  template = _.template($('#tmpl-race').html());

var refresh = function() {
  NProgress.start(); // show loading indicator
  
  return $.getJSON(ENDPOINT, function(data) {
    NProgress.done(); // hide loading indicator
    
    // Apply parsing/transformations to each candidate
    _.map(data.results.candidates, function(candidate) {
      candidate.percentage = parseFloat(candidate.percentage);
    });
    
    // Group candidates by race and put them into the races array
    var candidatesByRace = _.groupBy(data.results.candidates, 'race');
    data.results.races.forEach(function(row) {
      row.candidates = candidatesByRace[row.race];
    });
    
    
    // Clear the container
    var container = $('#main');
    container.empty();
    
    // For each race
    data.results.races.forEach(function(race) {
      // Sort candidates by percentage
      race.candidates = _.sortBy(race.candidates, function(candidate) { return -candidate.percentage; });
      
      // Append the race to the container using the template
      container.append(template(race));
    });
    
    // Set next refresh
    var timeToRefresh = INTERVAL || new Date(data.nextrun) - new Date() + 1000;
    window.setTimeout(refresh, timeToRefresh);
  });
};

refresh();