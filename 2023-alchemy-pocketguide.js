class AlchemyPocketGuide {
  sections = ['NEIGHBORHOODS','FEATURES','ART','CAMPS','EVENTS']
  model = null
  view = new EventGuide(null)
  
  onLoad() {
    Papa.parse(this.csvUrl instanceof URL ? this.csvUrl.href : this.csvUrl, {
      download: this.csvUrl instanceof URL,
      complete: (results) => {
        const data = new EventGuideData(this.sections)
        this.model = data.parseData(results)
        this.renderView()
      }
    })
  }
  
  renderView(data = null) {
    var viewData = new EventGuideData(this.sections).processData(data || this.model)
    this.view.data = viewData
    this.view.render()
  }
  
  print() {
    //window.print()
    alert('The Very Useful Pocket Guide is still in DRAFT mode. We will let you know when the print version is ready for publication.')
  }
  
  entireGuide() {
    this.setAllCommonSectionsVisible(true)
    this.renderView(this.model)
  }

  artOnly() {
    this.setAllCommonSectionsVisible(false)
    var model = JSON.parse(JSON.stringify(this.model))
    model.EVENTS = model.CAMPS = []
    this.renderView(model)
  }

  eventsOnly() {
    this.setAllCommonSectionsVisible(false)
    var model = JSON.parse(JSON.stringify(this.model))
    model.ART = model.CAMPS = []
    this.renderView(model)
  }
  
  campsOnly() {
    this.setAllCommonSectionsVisible(false)
    var model = JSON.parse(JSON.stringify(this.model))
    model.ART = model.EVENTS = []
    this.renderView(model)
  }

  centerCampOnly() {
    this.setAllCommonSectionsVisible(false)
    var model = JSON.parse(JSON.stringify(this.model))
    model.ART = model.CAMPS = []
    model.EVENTS = _.filter(model.EVENTS, event => event.location.toLowerCase() == 'center camp')
    this.renderView(model)
  }
  
  soundOnly() {
    this.setAllCommonSectionsVisible(false)
    var model = JSON.parse(JSON.stringify(this.model))
    model.ART = model.CAMPS = []
    model.EVENTS = _.filter(model.EVENTS, event => event.iconNames.includes('sound'))
    this.renderView(model)
  }
  
  foodOnly() {
    this.setAllCommonSectionsVisible(false)
    var model = JSON.parse(JSON.stringify(this.model))
    model.ART = model.CAMPS = []
    model.EVENTS = _.filter(model.EVENTS, event => event.iconNames.includes('food'))
    this.renderView(model)
  }

  setAllCommonSectionsVisible(visible) {
    EventGuide.setSectionVisible('Welcome Home!', visible)
    EventGuide.setSectionVisible('Maps', visible)
  }
}
