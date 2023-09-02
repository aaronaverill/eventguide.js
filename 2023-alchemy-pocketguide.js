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
  
  filter(filter) {
    var model = this.model
    if (!model) {
      return
    }
    if (filter == 'all') {
      this.setAllCommonSectionsVisible(true)
    } else {
      this.setAllCommonSectionsVisible(false)
      model = JSON.parse(JSON.stringify(this.model))
      switch(filter) {
        case 'art':
          model.EVENTS = model.CAMPS = []
          break
        case 'events':
          model.ART = model.CAMPS = []
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
    }
    this.renderView(model)
    this.setActiveButton(filter)
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
