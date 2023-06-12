# TODO

### Github workflows

- Make jekyll build from source on github servers

### design

- [ ] (\*\*\*) design / add style to review page
  - [x] hover back button
  - [ ] bullet journal / sticky notes vibes?
- [ ] (\*\*\*) mobile design
- (\*) make review pages clicable (expand from page in page)
- (\*\*\*) [ ] deal with scrollabiltiy (what happens if there is a lot of locations?)

### filtering

- (\*\*\*) [ ] add tag categories (extendable?) (in the location files)
  - cuisine
  - type restaurant / bar / bakery
  - price range
  - occasion
  - been to / not been to <- defer to backend existence
  - location (filter by city)- maybe needed for mobile <- defer to backend existance
- (\*\*\*) derived fields (in the review files) -> add these to the database.json
  - [x] rating (currently tracking two high-level reviews: overall and vibe)
  - last review date
  - number of reviews
- (\*) tag-based icons (toggle cuisine<>type, maybe toggle continuous params)
  - shape (design, line weight (?)) - 2ish params
  - colors (hue, saturation) - 2 params
- (\*\*) [ ] add your location on map? filter by nearby? (_WEBSITE WANTS TO KNOW YOUR LOCATION_ ;)
- (\*\*) sorting
- (\*\*) filtering

### UX/UI

- Improve the state tree
  - close button returns map to the last view state it was before a panel was open
  - if you are more zoomed in than focus zoom level and click a location then center your view on it without changing zoom state
  - back button just unrolls the state machine, same with forward

## later

- database <-> server
  - display other people's things on ur map (icon design - saturation? something)
- import restaurant descriptions from somewhere
- import form google-maps/beli/notion

## DONE

- (\*\*\*) [x] make icons clickable
  - (\*\*\*) [x] toggle panel
  - (\*) [x] make icon bigger / zoom in around it when corresp panel is open
- (\*\*\*) [x] make forward button work god damn it
