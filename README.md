# Bananas (name pending) [EXPERIMENTAL]

An experimental alternative to example based testing. It could be likened to a [generation-based fuzzer](https://en.wikipedia.org/wiki/Fuzz_testing#Techniques).

## Motivation

* Long running projects often result in large, slow and rigid 'system tests' (somtimes refered to as 'end to end' or 'integration' tests) which inevitably slow teams down.

* Teams often resort to a QA (or team) to 'curate' the test suite, this process is slow as the suites is often difficult to introspect and understand what is being tested.

* These suites will often test the same paths over and over again with subtle variations, this contributes to the tests being long.

## Hypothesis

The problems stated above stem from using example based testing tools (xUnit) via an interface that is inherently slow.

## What is it?

Bananas is a testing tool, which instead of focusing on distinct 'scenarios' or 'examples', focuses on 'transitions' that can be performed and the context in which those transitions can be performed. The tool is then responsible for constructing sets of 'transitions' in sequence and then running them.

## Status

***DONE***

* The project has a basic implementation that can generate an exhaustive suite for a TodoMVC application. [TodoMVC Test Model](test/integration)
* Can generate a state transition diagram e.g. [TodoMVC State Diagram](docs/todo-state-diagram.png)

***UP NEXT***

* Improve test generation, allowing for more tuning of test plans 
