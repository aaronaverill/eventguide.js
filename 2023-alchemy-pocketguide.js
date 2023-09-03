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
  
  renderView(viewData = null) {
    this.view.data = viewData || new EventGuideData(this.sections).processData(this.model)
    this.view.render()
  }
  
  print() {
    //window.print()
    alert('The Very Useful Pocket Guide is still in DRAFT mode. We will let you know when the print version is ready for publication.')
  }
  
  filter(filter) {
    if (!this.model) {
      return
    }

    const model = JSON.parse(JSON.stringify(this.model))

    // Adjust the parsed data model to remove some things based on the filter
    switch(filter) {
      case 'art':
        model.EVENTS = model.CAMPS = []
        break
      case 'events':
        model.ART = model.CAMPS = []
        break
      case 'stages':
        model.ART = model.EVENTS = []
        break
      case 'camps':
        model.ART = model.EVENTS = []
        break
      case 'center-camp':
        model.ART = model.CAMPS = []
        model.EVENTS = _.filter(model.EVENTS, event => event.location.toLowerCase() == 'center camp')      
        break
      case 'sound':
        model.ART = model.CAMPS = []
        model.EVENTS = _.filter(model.EVENTS, event => event.iconNames.includes('sound'))
        break
      case 'food':
        model.ART = model.CAMPS = []
        model.EVENTS = _.filter(model.EVENTS, event => event.iconNames.includes('food'))
        break
    }

    // Process the parsed data model to create data that the underscore templates will use
    const viewData = new EventGuideData(this.sections).processData(model)
    // Adjust the view data further based on the filter
    switch(filter) {
      case 'stages':
        viewData.CAMPS = []
        break
        case 'camps':
        viewData.stages = []
        break
    }

    // Refresh the view
    this.setActiveButton(filter)
    this.setAllCommonSectionsVisible(filter == 'all')
    this.renderView(viewData)
  }

  setActiveButton(filter) {
    const buttonBlock = document.querySelectorAll('.guidefilter-buttons a')
    buttonBlock.forEach(element => {
      const classes = _.reject(element.className.split(' '), className => className == 'filter-active')
      if (element.dataset.filter == filter) {
        classes.push('filter-active')
      }
      element.className = classes.join(' ')
    })
  }

  setAllCommonSectionsVisible(visible) {
    EventGuide.setSectionVisible('Welcome Home!', visible)
    EventGuide.setSectionVisible('Maps', visible)
  }
}
