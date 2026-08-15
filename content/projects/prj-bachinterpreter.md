+++
title = "Interpreter for a Musical Language"
date = 2026-08-01
template = "project_page.html"

[extra]
repo_url = "https://github.com/jayagarsi/Practica-LP"
+++

This project is a double interpreter for a musical language called JSBach. The language was designed to help implement musical compositions through programming algorithms. This was an assignment developed in the Programming Languages course at UPC.

Let us go over the simpe Insertion Sort algorithm implemented in JSBach. Notice how the syntax is quite similar to that of python.

```python
~~~ Binary Search algorithm ~~~

Main |:
    a <- {15 17 19 20 21 22 24 26 29 30 34 33 35 36 37 38 39 40 41 42 43 45}
    t <- 45
    BinarySearch a t
:|

~~~                         ~~~
~~~ Input:                  ~~~
~~~    - a: array           ~~~
~~~    - t: target          ~~~
BinarySearch a t |:
    n <- #a
    l <- 0
    r <- n-1
    while l <= r |:
        m <- l + (r-l)/2
        val <- random[5 15]
        <:> {m+val {m+val-3 m+val+3}}
        if a[m] < t |:
            l <- m+1
        :|
        if a[m] > t |:
            r <- m-1
        :|
        if a[m] = t |:
            <!> "Target is in position" m
            l <- r+1
        :|

    :|
    <!> "Not found :("
:|

```

The output consists of a set of audio files (```.mp3``` and ```.wav```) and a pdf file with the chore.

<audio controls src="/audio/binarysearch-1.mp3"></audio>
<audio controls src="/audio/binarysearch-2.mp3"></audio>

The language is very simple. Since it is interpreted by Python, the memory mangement is the same. For now, one can make recursive programs, list definitions, numeric computations, random generation of values, playing of notes and boolean operations. The full code can be checked in the Github, however for now the descriptions are all written in Catalan.

## Language Specification

