# D3js force-directed graph on cloud file-sharing

We demo a graph of cloud file-sharing events in an organization over 1 day.

In our setting, we have two kinds of entities: users + files,
and one kind of relationship: file sharing.

The idea can be generalized to other entities and/or relationships.

The original raw-data comes from a real cloud-activity log.

All data is anonymized. No actual user/file names are exposed.

<!-- iframe src="./index.html">Interactive force-directed chart</iframe -->

[Interactive Demo (can't embed, so not on github)](https://finance.yendor.com/ML/fileshare-d3js/)

## Demo source code:

  - [index.html](./index.html)
  - [force-directed-graph.js](./force-directed-graph.js)


## Graphical elements

  - Blue circles represent files
  - Black circles represent users
  - Red circles represent users outside the organization (email-id in another domain)
  - Edges are always between a user and a (shared) file
  - Thicker edges represent multiple sharing events
  - Each user/file has a unique id and appears exactly once in the chart
  - The entities (file, user) are what the forces act on
  - The relations between the entities are the forces acting on entities

## Interacting with the graph

  - Hover over circles to see the (anonymized) user/file ids
  - Click and drag some circle; the graph self-organizes again
  - Try to untangle some knots
  - Watch how the graph reacts when you release your mouse button
  - Click & drag an isolated small sub-graph over a long distance
  - Release & watch it settle in a new niche

## What exactly is a force-directed graph?

The forces that make this graph self-organize are very much like the
negative and positive charges in polar molecules. E.g. in a water
(`H2O`) molecule, there's a 104.5 &deg; (less than 180 &deg;) angle
between the two `H-0-H` covalent bonds. The asymmetry makes each
molecule a small dipole.

  - Opposite charges (a user & a file) attract each other
  - Similar charges (two files, or two users) repel each other
  - A global force: `gravity` pulls all objects towards the center of the canvas
  - A link-length (stand-off) parameter keeps linked objects from merging/colliding
  - A time-decay parameter gradually dampens forces as the graph settles

The attraction & repulsion forces cause the chart to self-organize into
a minimum potential-energy state.

Whenever disturbed, the time-decay parameter is reinitialized
to a high value, the forces increase, and the graph gradually
settles into a new state of equilibrium as the time-decay parameter
re-converges towards zero.

## Why is a force-directed graph valuable?

The biggest value of a force-directed visualization is that
it creates a ***meaningful global holistic view*** from many
***small & unrelated local details***.

There’s no model we need to build based on some pre-conceived
structure. The whole is a natural and direct result of its small parts.

IOW: the ***data computes itself into a picture*** that makes
all relationships very clear to the observer.

Another way to look at this method is that it reverses the
traditional roles of client and server in ML.
Normally, we train a machine-learning model on the server,
and present the final results to the client.
Here we’re doing the opposite: we have pure
***client-side (JavaScript in the browser) machine-learning***.
The computation heavy-lifting is off-loaded to the observer CPU.

## A picture is worth a 1000 words

So the saying goes, but a self-organizing picture, which creates
itself, and with which you can interact, may bring even more
insight and understanding.

## The graph tells many stories:

  - Some users share much more than others
  - Some small cliques of users as islands in the big picture
  - Some users share files only one person
  - Some teams are formed around single shared files, others have large
    shared file-sets.
  - Sub-graphs may represent sub-departments (or users who like to share with like minded colleagues)
  - Red circles may hint of a potential ex-filtration of data
  - There's an isolated file (File 499), likely a data issue

## Random notes

  - In this particular demo, the repelling force for users is set
  to be stronger than the repelling force between files,
  because the number of users is much smaller than the number
  of files so we want users to be spread more apart than files.

  - Force related constants which affect the speed of settling into
  equilibrium, the friction or "stiffness" of the chart, and others,
  can be configured in the code.

  - Without any sharing, all users are unrelated to each other and will
  float randomly in space. When two users share files among themselves,
  they become globally attracted to these files and end-up closer to
  each other. But because users repel each other, the files
  end-up between the users that share them. Plus, the files repel
  each other as well, so they don't all appear on top of each other.

  - The demo uses an old version (v3) of D3js, that is incompatible
  with the current (v7) version.

## Credits

Mike Bostock, [observablehq.com](https://observablehq.com/) and all
contributors to the D3js framework. All I did here is adapt one of their
examples to a different dataset, separate the raw data from the code,
and customize some parameters for better effect.

