class DateHelper {
  // A few named times, such as noon, dusk and midnight are translated into their explicit hour of day.
  static getNamedTime(date, time) {
    var namedTimes = {
      noon: 12,
      dusk: 19, // 7pm
      midnight: 0,
    }
    var namedTime = _.findKey(namedTimes, t => t == time.toLowerCase())
    if (namedTime) {
      date.setHours(namedTimes[namedTime])
      return date
    }
    return null
  }

  // This nasty bit of code parses a time string in a whole lot of weird formats (eg am/pm, missing punctuation, etc) and sets the time on the date passed in.
  static setEventTime(date, time) {
    if (DateHelper.getNamedTime(date, time)) {
      return date
    }

    time = String(time);
    var am = null;
    if (time.toLowerCase().includes("p")) am = false;
    else if (time.toLowerCase().includes("a")) am = true;
    time = time.replace(/\D/g, "");
    time = time.substring(0, 4);
    if (time.length === 3) time = "0" + time;
    time = time.replace(/^00/, "24");
    time = parseInt(time);
    var hours = 12,
        minutes = 0;
    if (Number.isInteger(time)) {
        if (time >= 0 && time <= 12) {
            hours = time;
            minutes = 0;
            if (am === null) {
                if (hours >= 1 && hours <= 12) am = false;
                else am = true;
            }
        } else if (time >= 13 && time <= 99) {
            hours = time % 24;
            minutes = 0;
            if (am === null) am = true;
        } else if (time >= 100) {
            hours = Math.floor(time / 100);
            minutes = time % 100;
            if (am === null) {
                if (hours >= 1 && hours <= 12) am = false;
                else am = true;
            }
        }
        if (am === false && hours !== 12) hours += 12;
        if (am === true && hours === 12) hours -= 12;

        hours = hours % 24;
        minutes = minutes % 60;
    }
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  }

  // Get the text representation of time of day, using noon and midnight as necessary.
  static getTimeOfDay(date) {
    var hours = date.getHours()
    var minutes = date.getMinutes()
    if ((hours == 0 || hours == 24) && minutes == 0) {
      return 'Midnight'
    } else if(hours == 12) {
      if (minutes == 0) {
        return "Noon"
      } else {
        return "Noon:" + minutes.toString().padStart(2, "0")
      }
    } else {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }
  }
}

class EventView {
  constructor(csv, sections) {
    this.csv = csv
    this.sections = sections
  }

  render() {
    var data = new EventGuideData(this.sections)
    Papa.parse(this.csv instanceof URL ? this.csv.href : this.csv, {
      download: this.csv instanceof URL,
      complete: (results) => {
        var model = data.parseData(results)
        var guide = new EventGuide(model)
        guide.render()
      }
    })
  }
}

class EventGuideData {
  constructor(sections) {
    this.sections = sections
  }

  static campIconNames = {
    'food': {
      image: '🍔',
      name: 'Food',
      infoText: 'Food'
    },
    'booze': {
      image: '🍸',
      name: 'Booze',
      infoText: 'Booze'
    },
    'party': {
      image: '🔥',
      name: 'Sound/Party',
      infoText: 'Sound/Party'
    },
    'sound/party': {
      image: '🔥',
      name: 'Sound/Party',
      infoText: 'Sound/Party'
    },
    'chill': {
      image: '😎',
      name: 'Chill',
      infoText: 'Chill'
    },
    'wellness/spiritual': {
      image: '🧘',
      name: 'Wellness/Spiritual',
      infoText: 'Wellness/Spiritual'
    },
    'art': {
      image: '🎨',
      name: 'Arts & Crafts',
      infoText: 'Arts & Crafts'
    },
    'arts & crafts': {
      image: '🎨',
      name: 'Arts & Crafts',
      infoText: 'Arts & Crafts'
    },
    'kids': {
      image: '👶',
      name: 'kids',
      infoText: 'kids'
    },
    'feels': {
      image: '💖',
      name: 'feels',
      infoText: 'feels'
    },
    'games': {
      image: '🎲',
      name: 'games',
      infoText: 'games'
    },
    'music': {
      image: '🎧',
      name: 'music',
      infoText: 'music'
    },
    'stage': {
      image: '🎸',
      name: 'Stage',
      infoText: 'Stage'
    },
    'performances': {
      image: '🎭',
      name: 'Performances',
      infoText: 'Performances'
    },
    'workshops': {
      image: '🎓',
      name: 'Workshops & Educational Classes',
      infoText: 'Workshops & Educational Classes'
    },
    'adult': {
      image: '🔞',
      name: 'Adult Activities',
      infoText: 'Adult Activities'
    },
    'sex': {
      image: '🍆',
      name: 'Sexual Activities',
      infoText: 'Sexual Activities'
    },
  }

  static eventIconNames = {
    'food': {
      image: '🍔',
      name: 'Food',
      infoText: 'Food'
    },
    'booze': {
      image: '🍸',
      name: 'Booze',
      infoText: 'Booze'
    },
    'party': {
      image: '🔥',
      name: 'Sound/Party',
      infoText: 'Sound/Party'
    },
    'sound/party': {
      image: '🔥',
      name: 'Sound/Party',
      infoText: 'Sound/Party'
    },
    'chill': {
      image: '😎',
      name: 'Chill',
      infoText: 'Chill'
    },
    'wellness/spiritual': {
      image: '🧘',
      name: 'Wellness/Spiritual',
      infoText: 'Wellness/Spiritual'
    },
    'art': {
      image: '🎨',
      name: 'Arts & Crafts',
      infoText: 'Arts & Crafts'
    },
    'arts & crafts': {
      image: '🎨',
      name: 'Arts & Crafts',
      infoText: 'Arts & Crafts'
    },
    'kids': {
      image: '👶',
      name: 'kids',
      infoText: 'kids'
    },
    'feels': {
      image: '💖',
      name: 'feels',
      infoText: 'feels'
    },
    'games': {
      image: '🎲',
      name: 'games',
      infoText: 'games'
    },
    'music': {
      image: '🎧',
      name: 'music',
      infoText: 'music'
    },
    'stage': {
      image: '🎸',
      name: 'Stage',
      infoText: 'Stage'
    },
    'performances': {
      image: '🎭',
      name: 'Performances',
      infoText: 'Performances'
    },
    'workshops': {
      image: '🎓',
      name: 'Workshops & Educational Classes',
      infoText: 'Workshops & Educational Classes'
    },
    'adult': {
      image: '🔞',
      name: 'Adult Activities',
      infoText: 'Adult Activities'
    },
    'sex': {
      image: '🍆',
      name: 'Sexual Activities',
      infoText: 'Sexual Activities'
    },
  }

  parseData(results) {
    var data = this.parseCsvData(results)
    this.processArt(data)
    this.processCamps(data)
    this.processEvents(data)
    return data
  }

  processArt(data) {
    if (data.ART) {
      data.ART = _.sortBy(data.ART, item => {
        return item.name.replace(/[\(\)]/,'').toLowerCase()
      })
    }
  }

  processCamps(data) {
    if (data.CAMPS) {
      data.CAMPS.forEach(item => {
        item.icons = this.getIcons(EventGuideData.campIconNames, item.iconNames)
      })
      data.CAMPS = _.sortBy(data.CAMPS, item => {
        return item.name.replace(/^([Tt]he )/,'').toLowerCase()
      })
    }
  }

  processEvents(data) {
    const tbdDate = new Date(2000,1,1)
    // Process event information by sorting into days and start times
    if (data.EVENTS) {
      var events = []
      data.EVENTS.forEach(item => {
        item.icons = this.getIcons(EventGuideData.eventIconNames, item.iconNames)
        // Events can have multiple days separated by commas, split into individual rows for each day
        var days = item.day.split(',')
        days.forEach(eventDay => {
          if (eventDay.trim()) {
            // Turn the day into an actual date
            var eventDate = this.getEventDate(eventDay)
            if (eventDate) {
              // Convert the start time to a consistent and friendly time label
              eventDate = DateHelper.setEventTime(eventDate, item.start.trim())
              var event = Object.assign({}, item, {
                eventDate: eventDate, 
                day: eventDate.toLocaleDateString(undefined, { weekday: 'long' }), 
                start: DateHelper.getTimeOfDay(eventDate)
              })
              events.push(event)
            } else {
              console.log(`Unrecognized day name:${eventDay.trim()}. Event '${item.name}' rejected.`)
            }

          // If there is no day set, the scheduled is TBD
          } else {
            var event = Object.assign({}, item, {
                eventDate: tbdDate, 
                day: 'TBD', 
                start: ''
              })
              events.push(event)
          }
        })
      })
      // Sort the events by start time
      events = _.sortBy(events, event => event.eventDate)
      // Collect the events into a daily list by start times
      var eventsByDay = []
      events.forEach(event => {
        var dayOfEvent = new Date(event.eventDate.getTime())
         // Events til 2am appear on prior day
        dayOfEvent.setHours(dayOfEvent.getHours()-2)
        dayOfEvent.setHours(0,0,0,0)        
        var eventsOnDay = _.find(eventsByDay, date => date.day.getTime() == dayOfEvent.getTime())
        if (!eventsOnDay) {
          eventsOnDay = {
            day: dayOfEvent,
            dayName: event.eventDate == tbdDate ? 'Not Scheduled Yet' : dayOfEvent.toLocaleDateString(undefined, { weekday: 'long' }),
            eventsByTime: []
          }
          eventsByDay.push(eventsOnDay)
        }
        var eventsAtTime = _.find(eventsOnDay.eventsByTime, timeSlot => timeSlot.time.getTime() == event.eventDate.getTime())
        if (!eventsAtTime) {
          eventsAtTime = {
            time: event.eventDate,
            timeText: event.start,
            events: []
          }
          eventsOnDay.eventsByTime.push(eventsAtTime)
        }
        eventsAtTime.events.push(event)

        eventsAtTime.events = _.sortBy(eventsAtTime.events, 'name')
      })
      data.eventsByDay = eventsByDay
    }
  }

  getIcons(iconNameMap, iconNames) {
    var icons = []
    if (!iconNames) {
      return icons
    }
    iconNames = _.map(iconNames.split(','), iconName => iconName.trim().toLowerCase())
    Object.keys(iconNameMap).forEach(iconName => {
      if (iconNames.includes(iconName.toLowerCase())) {
        icons.push(iconNameMap[iconName.toLowerCase()])
      }
    })
    return icons
  }

  getEventDate(eventDay) {
    eventDay = eventDay.trim().toLowerCase()
    return _.find(this.eventDates(), date => eventDay == date.toLocaleDateString(undefined, { weekday: 'long' }).toLowerCase())
  }

  parseCsvData(results) {
    var data = {}
    var section = null
    var fields = null
    // Parse the CSV rows into a data structure
    results.data.forEach(row => {
      // Column 0 indicates the section that follows
      if (row.length && this.sections.includes(row[0])) {
        section = row[0]
        fields = null
  
      } else if (section) {
        // Field names appear in the first row after a section
        if (!fields) {
          fields = row
  
        // All other rows are items
        } else {
          var item = {}
          fields.forEach((field, index) => {
            if (field) {
              item[field] = row[index].trim()
            }
          })
          // If we found data, add it
          if (item.publish) {
            if (!data[section]) {
              data[section] = []
            }
            data[section].push(item)
          }
        }
      }
    })
    return data
  }

  eventDates() {
    // The dates that the event runs.
    return [
      new Date('October 18, 2023'),
      new Date('October 19, 2023'),
      new Date('October 20, 2023'),
      new Date('October 21, 2023'),
      new Date('October 22, 2023'),
      new Date('October 23, 2023'),
    ]
  }
}

class EventGuide {
  constructor(data, rootElementId = 'event-pocket-guide', templateDataAttribute = 'data-template') {
    this.data = data
    this.rootElementId = rootElementId
    this.templateDataAttribute = templateDataAttribute
  }

  render() {
    console.log(this.data)
  
    Handlebars.registerHelper('breaklines', function(text) {
      text = Handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<p>');
      return new Handlebars.SafeString(text);
    })
  
    var guideElement = document.getElementById(this.rootElementId)
  
    var templateElements = document.querySelectorAll(`[${this.templateDataAttribute}]`)
    templateElements.forEach(element => {
      var template = document.getElementById(element.getAttribute(this.templateDataAttribute)).innerText
      element.innerHTML = Handlebars.compile(template)(this.data)
    })  
  }
}
