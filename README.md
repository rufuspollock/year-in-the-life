Visualize your year calendar on its own or alongside others and find patterns.

# Development

To build some stuff you need browserify:

```
browserify src/calendar-parse.js --standalone module -o src/bundle.js
```

# Use

Install a CORS enabling extension for your browser and enable it to use this app.

Why? This needs CORs and there is no reliable CORS proxy anymore as of 2020.

# Design

Goal: able to see when I am at la cheraille and when i have pre-existing books or commitments for the rest of the year (converse: when i have gaps)

## Tasks

* Month boundaries
* Show sylvie and mine side by side ...
* Split out month endings ...
* Show days of month
* Integrate with google calendar
  * Click through to google calendar (or show whole day below)

TODOs:

* Data import
* Legend with codes
* Showing ? or X for occupied, color for location ...

## Data Model

```
start       start date
end         end date
where       location
what        description of what i am doing
category    e.g. vacation, lm, personal etc
status      ?? confirmed or not confirmed
```

## User stories

### What time is booked / available

As Rufus I want to know what times i am definitively booked and busy so that I can plan around that

As Rufus I want to know what times I can book out for sprints so that I reserve that time

As Rufus I want to know what times I and Sylvie are both free so that we can schedule work together

As Rufus I want to know what times I am definitely in a particular location but not schedudled so that I can book activities there

As Rufus I want to know what time i'm at La Cheraille with nothing specific booked

As Rufus I want to know when I'm committed at Landmark so that I know what times are immovable and can't be booked for other stuff

### High level

As Rufus I want to plan out my year powerfully so that I can act with integrity and clearly do stuff

* A clear plan for fulfillment with defined actions
* A schedule for that plan

**What I need most of all is strategies in particular areas.**

**The point that you need dedicated time on these items to produce them ...**

=> I think that organizing around sprints works well

I think that clear goals work well

To organize sprints I need to know what time is already definitively committed.

=> what i first need is to see where i am already definitively committed

To schedule calls I need to have available times for calls.

What areas do I need to plan ...

* Open World Research Program
* Open World Book
* Data Collective

# Algorithm

Rule: all the time i'm not somewhere else i'm at la cheraille and available

> => what i first need is to see where i am already definitively committed

Pull current full set of calendars.

* Extract landmark dates
  * Additional dates where i am in e.g. London around that
* When I am visiting my parents
* Dates where I have definitive commitments e.g. Estonia, iMED

Could do this by hand for now ...

```
where(day) {
  for event in events:
    if day >= start and day <= end:
      // we're in that event and so occupied
      return true
}
```

# Research on Visualization

* https://bl.ocks.org/mbostock/4063318 - the original by mbostock
* https://github.com/DKirwan/calendar-heatmap - github style, popular
* https://github.com/g1eb/calendar-heatmap - most sophisticated (probably a bit much for me)
* Swim lane chart - http://bl.ocks.org/bunkat/1962173

