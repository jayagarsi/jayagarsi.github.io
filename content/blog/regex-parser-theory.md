+++
title = "How regular expressions are parsed"
date = 2026-09-01
description = "An overview on how to use Finite Automatas to parse regular expressions."
template = "blog_post.html"

[extra]
reading_time = "15 min read"
+++

<style>
.regex-block {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px 24px;
  margin: 24px 0;
}

.regex-block-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--border);
  font-size: 1rem;
  color: var(--accent);
  background: none;
}

.regex-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 480px) {
  .regex-columns {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.column-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.matches-label { color: #4ecdc4; }
.no-matches-label { color: #ff6b6b; }

.regex-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
}

.regex-matches {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.regex-matches li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
}

.match-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.match .match-icon {
  background: rgba(78, 205, 196, 0.15);
  color: #4ecdc4;
}

.no-match .match-icon {
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
}

.regex-matches code {
  color: var(--text);
  background: none;
}

.regex-cheatsheet {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px 24px;
  margin: 24px 0;
}
</style>

The first time I heard about regular expressions, regular languages and automatas was in a Theory of Computation course. A very interesting course that served as an introduction to formal languages and compilers. Here you will find a small project I developed to understand more how regular expressions are processd using a small parser and Non-Deterministic Finite Automatas.

## Regular Expressions

Regular expressions are a sequence of characters that represent a text pattern. Let us take as an example the expression that represents strings that start with 'a' and end with 'd', and have zero or more 'b' or 'c' characters between them.

<div class="regex-block">
  <div class="regex-block-header">
    <span class="regex-label">Pattern</span>
    <code>a(b|c)*d</code>
  </div>
  <div class="regex-columns">
    <div>
        <div class="column-label matches-label">Matches</div>
        <ul class="regex-matches">
            <li class="match"><span class="match-icon">✓</span><code>ad</code></li>
            <li class="match"><span class="match-icon">✓</span><code>abcbcd</code></li>
            <li class="match"><span class="match-icon">✓</span><code>accccd</code></li>
        </ul>
    </div>
    <div>
        <div class="column-label no-matches-label">No match</div>
        <ul class="regex-matches">
            <li class="no-match"><span class="match-icon">✗</span><code>abc</code></li>
            <li class="no-match"><span class="match-icon">✗</span><code>xyz</code></li>
            <li class="no-match"><span class="match-icon">✗</span><code>aabbd</code></li>
        </ul>
    </div>
  </div>
</div>

The notation can be a bit confusing the first time, but the idea behind it is simple. As one might imagine, these expressions are very useful to process text in different ways. But how does one do that efficiently? By using automatas.

## Finite Automata Theory

Automatas are machines that process an input string one character at a time while moving through a set of states. When the number of states is fixed we talk about finite automatas. The fun part about all this is that every regular expression has an equivalent automata that represents it. Since this is not a very formal blog you'll have to believe me on that, but you can check it in different books [[1](#ref1)], [[2](#ref2)]. Let us see it with the previous regular expression ```a(b|c)*d```.

![DFA processing "asda](/images/automaton-demo.gif)

But how does one compute this graph? Now that is the tricky part. There are a few things to do. First, we need to parse the regular expression and properly recognise where the operators lie. Secondly, once we have parsed the expression, we must build the automata that is equivalent to this expression. Let us go over this.

## Regex syntax parsing
The first thing to do is to analyze the regular expression. This comes as a regular string in the input, but there are special characters like ```*```, ```|``` or ```()``` that must be treated specially. Operator precedence must be preserved, since ```(a|b)*``` is not the same as ```a|b*```, which is equivalent to ```a|(b*)```. 


## References

<ol>
  <li id="ref1">
  Sipser, M. (2013). Introduction to the theory of computation (Third edition). Cengage Learning.</li>
  <li id="ref2">A. V. Aho, M. S. Lam, R. Sethi, and J. D. Ullman, <em>Compilers: Principles, Techniques, and Tools</em>, 2nd ed. Boston, MA: Addison-Wesley, 2006.</li>
  
</ol>


