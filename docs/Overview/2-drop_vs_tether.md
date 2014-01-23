## Drop vs Tether

Drop is a library built on the Tether positioning engine.  Tether is intentionally
designed to only handle positioning.  You give it an element and a target,
and it keeps the element where you want it relative to the target.

Quickly it became clear that while that simplicity allowed Tether to be more powerful,
many of it's use cases required a few more concepts.  Specifically, Drop adds the following
on top of Tether:

- The concept of the element being 'opened' or 'closed', and the ability to link events
to the opening and closing.
- Drop creates the actual element for you, and adds a 'drop-content' element inside of it
to make styling easier.
- A simpler attachment syntax that assumes you always want to place the drop in one
of twelve positions outside the target.
- A class on the body to allow you to style elements differently when a drop is opened.
- CSS themes with nice arrow-y bits and animation

It's very possible that a sufficiently complex application will eventually outgrow
Drop and decide to move to using Tether directly.  You can always pass `tetherOptions`
to your Drop instance if you need to more explicit control of Tether's behavior.
