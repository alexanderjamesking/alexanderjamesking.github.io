---
title: "Spy + Any"
date: 2026-04-21T12:00:00+01:00
description: "expressive argument matching in clojure.test"
tags: ["work"]
reading_time: "6 min"
---

People have asked more than once whether [spy](https://github.com/alexanderjamesking/spy)
should have built-in argument matchers like they were used to in tools such as [Mockito](https://site.mockito.org/)
but I was always reluctant to add them, the reason being, I felt Clojure was expressive enough and it would
add a lot of bloat to the library.

Recently, I noticed that my former colleague [Ivan Grishaev](https://github.com/igrishaev) released
[any](https://github.com/igrishaev/any), a small library of values with custom equality
semantics. It is not a matcher framework bolted onto a test runner. It is just Clojure
values that know how to compare themselves via `equiv`. When I saw it I thought this
would pair well with spy.

When you use `spy` to verify that a function was called with certain arguments, you
sometimes care about the shape of those arguments more than their exact values.
Generated IDs and timestamps are values that your code produces, but they typically not
values you want to assert on.

Say we spy on a function that stores a record with a generated UUID and timestamp:

```clojure
(let [f (spy/spy identity)
      _ (f {:id (random-uuid)
            :title "Nevermind"
            :created-at (Instant/now)})
      [[arg]] (spy/calls f)]
  (is (uuid? (:id arg)))
  (is (= "Nevermind" (:title arg)))
  (is (inst? (:created-at arg))))
```

This works, but the structure of the map is scattered across three separate assertions
and the test doesn't read as a description of what we actually care about.

`spy/called-with?` compares arguments using Clojure's `=`. `any` provides
values that implement `IPersistentCollection/equiv` with custom logic, so they
participate in `=` as matchers. There is no adapter layer, no protocol to extend, no
configuration needed. The same assertion becomes:

```clojure
(let [f (spy/spy identity)
      _ (f {:id (random-uuid)
            :title "Nevermind"
            :created-at (Instant/now)})]
  (is (spy/called-with? f {:id         any/uuid
                           :title      "Nevermind"
                           :created-at any/Instant})))
```

Specify the values you control, use matchers for everything generated.
The intent is immediate. `any` gives you a toolkit of matcher
values and a macro to build your own. They all behave as first-class values so you
can embed them anywhere `=` is used.

```clojure
any/string
any/uuid
any/int
any/float
any/keyword
any/symbol
any/map
any/vector
any/set
any/list
any/not-nil
```

```clojure
(let [f (spy/spy (constantly nil))
      _ (f {:to "Donovan" :body "Catch the wind"})]
  (is (spy/called-with? f {:to any/string :body any/string})))

```

```clojure
(let [f (spy/spy (constantly nil))
      _ (f {:title "Hummer"
            :genres [:rock :alternative]
            :tags #{:active}})]
  (is (spy/called-with? f {:title  any/string
                           :genres any/vector
                           :tags   any/set})))
```

```clojure
;; Java time
any/Instant
any/LocalDate
any/LocalDateTime
any/LocalTime
any/OffsetDateTime
any/ZonedDateTime
any/Period

;; Byte arrays
any/bytes

;; String content
(any/includes "sub")
(any/starts-with "pre")
(any/ends-with "suf")

;; Regex — full match vs partial match
(any/re-matches #"Playing \".*\" now")
(any/re-find #"John Lennon")

;; Enum — documents which values are valid
(any/enum :pending :paid :failed)

;; Range — bounds are [from, to)
(any/range 1 1000)

;; Collection size
(any/count 3)

;; Instance
(any/instance clojure.lang.IPersistentMap)

;; UUID strings — for systems that pass UUIDs as strings
any/uuid-string

;; Custom — builds a matcher from any predicate; reusable as a var
(any/any [n "positive even int"] (and (int? n) (pos? n) (even? n)))
```

Ivan did a great job with [any](https://github.com/igrishaev/any). The library is small,
focused, and composed well with `spy` without either side needing to know about the other,
which is exactly how good Clojure libraries should work.

If you're using `spy` and you need argument matchers, try `any`.
