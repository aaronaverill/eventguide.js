# eventguide.js


<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.8/handlebars.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="https://aaronaverill.github.io/eventguide.js/eventguide.js?v0.0.1"></script>

<script>
var csv = new URL('https://docs.google.com/spreadsheets/d/e/2PACX-1vRRPIZfX5vvPgBpOKg2FhtZLTEy6eP7j3XedCeatinlD40yL9hzRI6wfodubi2O51qvYGxJBELMutOb/pub?output=csv')
var sections = ['NEIGHBORHOODS','FEATURES','ART','CAMPS','EVENTS']
var view = new EventView(csv, sections)
window.addEventListener("load", view.render)
</script>

<style>
.print-only {
  display: none;
}
.event-section-header {
}
.event-item-block {
  break-inside: avoid;
  padding-bottom: 1rem;
}
.event-item-title h3 {
  color: #333;
  display: inline-block;
  font-size: 1.8rem;
  font-weight: lighter;
  letter-spacing: -.8px;
  line-height: 100%;
  margin-bottom: 0;
  text-transform: none;
}
.event-item-title h5 {
  display: inline;
  font-size: 1.2rem;
}
.event-item-description {
  padding-top: .5rem;
}
.event-section-two-column {
  column-count: 2;
  column-gap: 1rem;
}
.event-section-two-column .event-item-title,
.event-section-two-column .event-item-subtitle, 
.event-section-two-column .event-item-description {
  text-align: center;
}
.event-artist-name {
  font-weight: bold;
}
.event-day-header,
.event-time-header {
  text-align: center;
}
.event-day-header {
  background-color: #e0eaf0;
  font-size: 1.7rem;
  padding-top: .7rem;
  padding-bottom: .8rem;
}
.event-time-header {
  font-size: 1.4rem;
  margin-top: .2rem;
  margin-bottom: 0;
}
@media print {
  .print-only {
    display: initial !important;
  }
  .screen-only {
    display: none;
  }
  body {
    -webkit-print-color-adjust: exact !important;
  }
  header#header,
  #preFooter,
  footer#footer {
    display:none;
  }
  main#page {
    padding: 0;
  }
  a.sqs-block-button-element {
    display: none !important;
  }
  @page {
    margin: 0.6in;
  }
  .event-item-description {
    line-height: 1.5rem;
    font-size: 1.1rem;
  }
  .event-day-header {
    background-color: #f0f0f0;
    border-bottom: 1px solid #333;
  }
}
</style>

<div id="event-pocket-guide">
  <h2 class="event-section-header">Art</h2>
  <div class="event-section-ART event-section-two-column" data-template="event-template-ART"></div>
<script id="event-template-ART" type="text/x-handlebars-template">
  {{#each ART}} 
  <div class="event-item-block">
    <div class="event-item-title">
      <h3>{{name}}</h3>
    </div>
    <div class="event-item-subtitle">by <span class="event-artist-name">{{artist}}</span>{{#if location}} &bull; {{location}}{{/if}}{{#if grant}} &bull; <strong>Awarded {{grant}}</strong>{{/if}}</div>
    <div class="event-item-description">{{breaklines description}}</div>
  </div>
  {{/each}}
</script>
  <h2 class="event-section-header">Events</h2>
  <div class="event-section-EVENTS" data-template="event-template-EVENTS"></div>
<script id="event-template-EVENTS" type="text/x-handlebars-template">
  {{#each eventsByDay}} 
  <h3 class="event-day-header">{{dayName}}</h3>
    {{#each eventsByTime}}
    <h4 class="event-time-header">{{timeText}}</h4>
      {{#each events}}
      <div class="event-item-block">
        <div class="event-item-title">
          <h5>{{type}} {{name}} ({{duration}})</h5> with <strong>{{host}}</strong> at <strong>{{location}}</strong>
        </div>
        <div class="event-item-description">{{breaklines description}}</div>
      </div>
      {{/each}}
    {{/each}}
  {{/each}}
</script>
  <!-- Stages? -->
  <h2 class="event-section-header">Camps</h2>
  <div class="event-section-CAMPS event-section-two-column" data-template="event-template-CAMPS"></div>
<script id="event-template-CAMPS" type="text/x-handlebars-template">
  {{#each CAMPS}} 
  <div class="event-item-block">
    <div class="event-item-title">
      <h3>{{name}}{{#if mapid}} &bull; ({{mapid}}){{/if}}</h3>
    </div>
    <div class="event-item-subtitle">{{#each genreIcons}}{{this}} {{/each}}{{#if neighborhood}} &bull; {{neighborhood}}{{/if}}</div>
    <div class="event-item-description">{{breaklines description}}</div>
  </div>
  {{/each}}
</script>
</div>
