---
title: "Spy"
date: 2018-04-28T19:41:53+02:00
description: "A Clojure and ClojureScript library for stubs, spies, and mocks"
tags: ["work"]
---

As of today, there are two main libraries used for testing in Clojure, [clojure.test](https://clojure.github.io/clojure/clojure.test-api.html) and [Midje](https://github.com/marick/Midje). clojure.test is extremely simple and it provides a very small API allowing you to write a basic test suite, Midje on the other hand is slightly more complex but it provides a wealth of features.

Spy is a library I have written that is aimed at clojure.test users, it can be used with both Clojure and ClojureScript. If you're using Midje then it provides some similar helper functions so you likely don't need to use Spy.

I wrote Spy as I have a preference for clojure.test and I wanted some basic stubbing and spying features like those available in sinon.js or Mockito
Testing using Spy

Let's start with the following example which looks up an email address given an id and a message then sends a message to that email address.

{{< highlight Clojure >}}
(def beatle->email
  {:john   "john.lennon@beatles.com"
   :paul   "paul.mccartney@beatles.com"
   :george "george.harrison@beatles.com"
   :ringo  "ringo.starr@beatles.com"})

(defn lookup-email [beatle-id]
  (get beatle->email beatle-id))

(defn send-message [email message]
  (println (str "Sending " message " to " email))
  nil)

(defn email-beatle [beatle-id message]
  (when-let [email (lookup-email beatle-id)]
    (send-message email message)))
{{< / highlight >}}


And let's assume for now that we want to test that send-message is called only when the id passed into the email-beatle function actually matches a beatle in our map.

We can use [with-redefs](https://clojuredocs.org/clojure.core/with-redefs) to replace the send-message function with a spy, the original function is wrapped by the spy so we can test the function was called.

{{< highlight Clojure >}}
(def beatle->email
  {:john   "john.lennon@beatles.com"
   :paul   "paul.mccartney@beatles.com"
   :george "george.harrison@beatles.com"
   :ringo  "ringo.starr@beatles.com"})

(defn lookup-email [beatle-id]
  (get beatle->email beatle-id))

(defn send-message [email message]
  (println (str "Sending " message " to " email))
  nil)

(defn email-beatle [beatle-id message]
  (when-let [email (lookup-email beatle-id)]
    (send-message email message)))

(deftest email-beatle-test
  (testing "A message is sent to a Beatle"
    ;; example 1 - wrap the original fn (so it is still called)
    (with-redefs [send-message (spy/spy send-message)]
      (email-beatle :ringo "Hello Ringo!")
      (is (spy/called-once? send-message))
      (is (spy/called-with? send-message
                            "ringo.starr@beatles.com"
                            "Hello Ringo!"))))

  (testing "A message is not sent to a Rolling Stone"
    ;; example 2 - call spy without passing a fn (to avoid sending the email)
    (with-redefs [send-message (spy/spy)]
      (email-beatle :mick "Hello Mr Jagger!")
      (is (spy/not-called? send-message)))))
{{< / highlight >}}

For more examples on using Spy to test your Clojure code head over to the GitHub project: [Spy](https://github.com/alexanderjamesking/spy). If you find this useful and want to contribute to the library feel free to contact me on GitHub or raise a PR.
