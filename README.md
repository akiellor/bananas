# Bananas (name pending) [EXPERIMENTAL]

An experimental alternative to example based testing for system testing.

## What is it?

Bananas is a testing tool, which instead of focusing on distinct 'scenarios' or 'examples', focuses of modelling the system as a state machine. With this state machine, Bananas will generate a set of tests which exercise and verify the system under test.

## Motivation

* Long running projects often result in large, slow and rigid 'system tests' (somtimes refered to as 'end to end' or 'integration' tests) which inevitably slow teams down.

* Teams often resort to a QA (or team) to 'curate' the test suite, this process is slow as the suites is often difficult to introspect and understand what is being tested.

* These suites will often test the same paths over and over again with subtle variations, this contributes to the tests being long.

* Poor organization of these suites often results in new developers duplicating scenarios or assertions when adding new tests, this compounds the problem.

* The ratio between number of system behaviours or user interactions to lines of test code is often quite poor.

* Visibility into what the test suite does can often be very difficult to find on large suites.

The underlying hypothesis is that these problems stem from using example based testing tools (xUnit) via an interface that is inherently slow.

## Terminology

* **Test Plan**: A test plan is a set of tests. 

* **Test**: A valid sequence of transitions with assertions interleaved.

* **Transition**: A transition is composed of the following:
  * **requires**: A predicate to determine if the ***transition*** is applicable for the given ***model-state***.
  * **provides**: A transformation applied to the ***model-state***, this transformation indicates how the ***transition*** should change the ***system-state***.
  * **apply**: A mutation applied to the system under test.

* **Verification**: A verification is composed of the following:
  * **requires**: A predicate to determine if the ***verification*** is applicable for the given ***model-state***.
  * **apply**: An assertion against the system under test.

## Status

The project is currently in active development and research. Things will unapologetically break as this is an experiment.

Contributions in the form of ideas, code or feedback are all welcome.

There has been some progress in the following areas:

### Generation

There are currently two strategies for generating tests named **brute** and **quick**. Brute will exercise every transition possible from every system state possible in the defined model. Quick follows a [Random Walk](https://en.wikipedia.org/wiki/Random_walk) through the model, generating a single test. Both of these strategies are used in the [System Spec](test/system_spec.js).

A reasonably complete model for todomvc can be found [here](test/models/todomvc.js)

A weighted random walk is still being investigated as a way of encoding things like *highest value scenario*.

### Inspection

Given the data centric nature of the defined models, it is easy to perform analysis or display information about the model in different ways.

The [states](bin/states) script is able to take a model and generate a **graphviz** compatible graph of all the possible states and the valid transitions between them. Find an example [here](docs/todo-state-diagram.png) for the todomvc model.

There is still much room for improvement when it comes to test plan analysis and test naming. The current naming strategy is a hash of the transition names in the the test, this is not very user freindly.
