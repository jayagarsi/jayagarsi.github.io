+++
title = "How regular expressions are parsed"
date = 2026-09-01
description = "An overview on how to use Finite Automatas to parse regular expressions."
template = "blog_post.html"

[extra]
reading_time = "20 min read"
math = true
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

.thompson-wrap {
  --bg: var(--bg); --fg: var(--text); --muted: var(--text-dim); --line: var(--surface);
  --accent: #d9480f; --r: #1c7ed6; --s: #2f9e44;
  --mono: ui-monospace, "JetBrains Mono", Menlo, monospace;
  overflow-x: auto; margin: 2rem 0; color: var(--fg);
}
.thompson { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
.thompson th {
  text-align: left; font-size: 0.75rem; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--muted);
  border-bottom: 2px solid var(--fg); padding: 0.5rem 0.75rem;
}
.thompson tbody th { font-size: 0.95rem; letter-spacing: 0; text-transform: none; color: var(--fg); border-bottom: 1px solid var(--line); }
.thompson td, .thompson tbody th { padding: 1rem 0.75rem; border-bottom: 1px solid var(--line); vertical-align: middle; }
.thompson code { font-family: var(--mono); background: color-mix(in srgb, var(--accent) 10%, transparent); padding: 0.1em 0.4em; border-radius: 4px; }
.thompson tbody tr:hover { background: color-mix(in srgb, var(--accent) 6%, transparent); }
.thompson .legend { font-size: 0.85rem; color: var(--muted); margin-top: 0.75rem; }
 
/* diagrams */
.nfa { width: 100%; min-width: 200px; max-width: 260px; height: auto; }
.nfa .s { fill: var(--bg); stroke: var(--fg); stroke-width: 1.5; }
.nfa .in { fill: none; }
.nfa .new { stroke: var(--accent); }
.nfa .e { fill: none; stroke: var(--fg); stroke-width: 1.5; marker-end: url(#th-arr); }
.nfa .eps { stroke: var(--accent); stroke-dasharray: 5 3; marker-end: url(#th-arr-eps); }
.nfa .box-r { fill: color-mix(in srgb, var(--r) 14%, transparent); stroke: var(--r); stroke-width: 1.5; }
.nfa .box-s { fill: color-mix(in srgb, var(--s) 14%, transparent); stroke: var(--s); stroke-width: 1.5; }
.nfa text { fill: var(--fg); font-family: var(--mono); font-size: 14px; }
.th-arr { fill: var(--fg); }
.th-arr-eps { fill: var(--accent); }
 
/* dim everything except what the rule adds, on hover */
.thompson tbody tr:hover .nfa .e:not(.eps) { opacity: 0.4; }
.thompson tbody tr:hover .nfa .eps { stroke-width: 2.5; }
 
/* draw-in animation when the table is hovered */
@media (prefers-reduced-motion: no-preference) {
  .thompson tbody tr:hover .nfa .eps { animation: th-dash 0.8s linear infinite; }
  @keyframes th-dash { to { stroke-dashoffset: -16; } }
}
 
/* phone: rows become cards */
@media (max-width: 700px) {
  .thompson thead { display: none; }
  .thompson tr { display: block; padding: 1rem 0; border-bottom: 1px solid var(--line); }
  .thompson td, .thompson tbody th { display: block; border: 0; padding: 0.25rem 0; }
  .thompson td::before { content: attr(data-label); display: block; font-size: 0.7rem; text-transform: uppercase; color: var(--muted); }
}


</style>

The first time I heard about regular expressions, regular languages and automatas was in a Theory of Computation course. A very interesting course that served as an introduction to formal languages and compilers. Very boring for some and very fun for lil' nerdies (like me). Here you will find a small project I developed to understand more how regular expressions are processd using a small parser and Non-Deterministic Finite Automatas.

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

Automatas are machines that process an input string one character at a time while moving through a set of states. Very dense definition indeed. Since an image is worth more than a thousand words, belowe I present a gif representing an automata. I said that we need automatas to process regular expressions. And one might reasonably wonder: "What does a string have anything to do with a graph?". Well my dear readers, some years ago, some researchers in some journal published a paper proving that every regular expression has an equivalent automata that represents it [[1](#ref1)] [[2](#ref2)]. Magical really. But before going into more details on that, the automata here represents the expression ```a(b|c)*d```.

{{ themed_img(light="/drawer/out/automaton-demo-light.gif", dark="/drawer/out/automaton-demo-dark.gif", alt="DFA processing abcbcd") }}

As the little animation (made by me) shows, there is an initial state (the one with no incoming edges) and an accepting state (marked in blue). The automata consumes the string, character by character until it is completely parsed. Starting from the initial state, it moves around consuming the string. If by the end of the string, the automata is in an accepting state, we say that the input string is recognised by the machine. Very simple and fun stuff if you ask me.

But now, how does one compute this graph? That is the tricky part. We need a few things; first, we need to parse the regular expression and properly recognise where the operators lie. Secondly, once we have parsed the expression, we must build the automata that is equivalent to this expression. Looks hard, but we'll go over the whole process in detail.

## Regex syntax parsing
The first thing to do is to analyze the regular expression. This comes as a string in the input, but there are special characters like ```*```, ```|``` or ```()``` that must be treated specially. Operator precedence must be preserved, since ```(a|b)*``` is not the same as ```a|b*```, which is equivalent to ```a|(b*)```. To do so, the very wise bible of compilers [[2](#ref2)], shows us how to use a Recursive-Descent parser to get the expression ordered by preference. Before getting into the details let us check what this would look like for the previous example.


<div class="mermaid-wrapper">
    <pre class="mermaid">
    flowchart LR
        a(("·")):::brand --> b(("*")):::brand
        a --> c(("d")):::brand
        b --> d(("·")):::brand
        d --> e(("|")):::brand
        e --> f(("b")):::brand
        e --> g(("c")):::brand
    </pre>
</div>

The symbol "·" represents de concatenation between strings, hence, ```ab``` is equivalent to ```a·b```. If anyone is interested, this tree is called an Abstract Syntax Tree. To simplify, it does just what we wanted: represent in a simple form (a tree) the operator preference in the regular expression. Each level in the tree corresponds to a different operator coverage. Such a nice and simple thing to compute. The idea behind it is a bit more complex. It involves LL(1)-grammars and other aspects of formal language theory.

Imagine we could have a way of describing how the regular expressions can be formed. We could say how the operators ```*```, ```|``` and ```?``` can be used and what is the syntax that must be used. Just like how grammar explains how sentences can be formed given a set of words. This is exactly the same behavior for formal grammars. Given a set of words in an alphabet, it tells us how we can form "sentences". Notice that the term sentence here applies a bit differently than with spoken languages. If you want more information on this the Sipser book [[1](#ref1)] covers this very well. For the curios people, this is the LL(1) grammar that was used to parse the expressions:

{% math() %}  
\begin{align}
expr    &\rightarrow term \; (\text{'|' }term)^* \\
term    &\rightarrow factor^* \\
factor  &\rightarrow atom \; postfix? \\
postfix &\rightarrow \text{'*' | '+' | '?'} \\
atom    &\rightarrow CHAR \text{ | '(' } expr \text{ ')'}
\end{align}
{% end %}


Having the grammar, the recursive-descent parser is very easy to implement, since we each rule corresponds to one method in code.

Now we (mostly) know how to parse a regular expression. Let us go now to the real deal.

## Thompston's construction

Thompston's algorithm is a method that describes how to build Non-Finite Deterministic Automatas from given regular expressions. The idea is to recursively build the NFA by traversing the AST. Thompston's method says how each element in a regular expression must be transformed into a NFA. Since a picture is worth a thousand words, below you can find how each element is translated into a state machine. 

<div class="thompson-wrap">
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <marker id="th-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="th-arr" d="M0,0 L10,5 L0,10 z"/></marker>
    <marker id="th-arr-eps" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="th-arr-eps" d="M0,0 L10,5 L0,10 z"/></marker>
  </defs>
</svg>
<table class="thompson">
  <caption style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Thompson's construction rules</caption>
  <thead>
    <tr><th scope="col">Construction</th><th scope="col">Regex</th><th scope="col">NFA fragment</th><th scope="col">Intuition</
  </thead>
  <tbody>
    <tr>
      <th scope="row" data-label="Construction">Empty string</th>
      <td data-label="Regex"><code>ε</code></td>
      <td data-label="NFA fragment">
        <svg class="nfa" viewBox="0 0 300 150" role="img" aria-label="Start state with an epsilon edge to the accept state">
          <path class="e" d="M5,75 L35,75"/>
          <path class="e eps" d="M50,75 L228,75"/>
          <circle class="s new" cx="50" cy="75" r="15"/>
          <circle class="s new" cx="250" cy="75" r="19"/><circle class="s in new" cx="250" cy="75" r="15"/>
        </svg>
      </td>
      <td data-label="Intuition">Move from start to accept without reading any input.</td>
    </tr>
    <tr>
      <th scope="row" data-label="Construction">Single symbol</th>
      <td data-label="Regex"><code>a</code></td>
      <td data-label="NFA fragment">
        <svg class="nfa" viewBox="0 0 300 150" role="img" aria-label="Start state with an edge labeled a to the accept state">
          <path class="e" d="M5,75 L35,75"/>
          <path class="e" d="M50,75 L228,75"/>
          <text x="140" y="65" text-anchor="middle">a</text>
          <circle class="s new" cx="50" cy="75" r="15"/>
          <circle class="s new" cx="250" cy="75" r="19"/><circle class="s in new" cx="250" cy="75" r="15"/>
        </svg>
      </td>
      <td data-label="Intuition">Read exactly one symbol, then accept.</td>
    </tr>
    <tr>
      <th scope="row" data-label="Construction">Concatenation</th>
      <td data-label="Regex"><code>RS</code></td>
      <td data-label="NFA fragment">
        <svg class="nfa" viewBox="0 0 300 150" role="img" aria-label="Machine R connected to machine S by an epsilon edge">
          <path class="e" d="M5,75 L28,75"/>
          <rect class="box-r" x="30" y="52" width="85" height="46" rx="8"/><text x="72" y="80" text-anchor="middle">R</text>
          <rect class="box-s" x="185" y="52" width="85" height="46" rx="8"/><text x="227" y="80" text-anchor="middle">S</text>
          <path class="e eps" d="M115,75 L183,75"/>
        </svg>
      </td>
      <td data-label="Intuition">Finish R, then continue straight into S.</td>
    </tr>
    <tr>
      <th scope="row" data-label="Construction">Union</th>
      <td data-label="Regex"><code>R|S</code></td>
      <td data-label="NFA fragment">
        <svg class="nfa" viewBox="0 0 300 150" role="img" aria-label="New start state branching by epsilon edges into R and S, which rejoin at a new accept state">
          <path class="e" d="M2,75 L18,75"/>
          <rect class="box-r" x="105" y="12" width="90" height="42" rx="8"/><text x="150" y="38" text-anchor="middle">R</text>
          <rect class="box-s" x="105" y="96" width="90" height="42" rx="8"/><text x="150" y="122" text-anchor="middle">S</text>
          <path class="e eps" d="M42,67 L103,36"/>
          <path class="e eps" d="M42,83 L103,114"/>
          <path class="e eps" d="M195,36 L255,66"/>
          <path class="e eps" d="M195,114 L255,84"/>
          <circle class="s new" cx="30" cy="75" r="15"/>
          <circle class="s new" cx="270" cy="75" r="19"/><circle class="s in new" cx="270" cy="75" r="15"/>
        </svg>
      </td>
      <td data-label="Intuition">Branch without consuming input, then rejoin.</td>
    </tr>
    <tr>
      <th scope="row" data-label="Construction">Kleene star</th>
      <td data-label="Regex"><code>R*</code></td>
      <td data-label="NFA fragment">
        <svg class="nfa" viewBox="0 0 300 150" role="img" aria-label="New start and accept states around R, with an epsilon loop back into R and an epsilon bypass">
          <path class="e" d="M2,75 L18,75"/>
          <rect class="box-r" x="100" y="55" width="100" height="40" rx="8"/><text x="150" y="80" text-anchor="middle">R</text>
          <path class="e eps" d="M45,75 L98,75"/>
          <path class="e eps" d="M200,75 L250,75"/>
          <path class="e eps" d="M185,55 C185,10 115,10 115,53"/>
          <path class="e eps" d="M32,90 C45,148 255,148 268,95"/>
          <circle class="s new" cx="30" cy="75" r="15"/>
          <circle class="s new" cx="270" cy="75" r="19"/><circle class="s in new" cx="270" cy="75" r="15"/>
        </svg>
      </td>
      <td data-label="Intuition">Loop back to R any number of times, or skip it.</td>
    </tr>
    <tr>
      <th scope="row" data-label="Question">Question</th>
      <td data-label="Regex"><code>R?</code></td>
      <td data-label="NFA fragment">
        <svg class="nfa" viewBox="0 0 300 150" role="img" aria-label="If R is present jump to it, otherwise go to final state.">
          <path class="e" d="M2,75 L18,75"/>
          <rect class="box-r" x="100" y="55" width="100" height="40" rx="8"/><text x="150" y="80" text-anchor="middle">R</text>
          <path class="e eps" d="M45,75 L98,75"/>
          <path class="e eps" d="M200,75 L250,75"/>
          <path class="e eps" d="M32,90 C45,148 255,148 268,95"/>
          <circle class="s new" cx="30" cy="75" r="15"/>
          <circle class="s new" cx="270" cy="75" r="19"/><circle class="s in new" cx="270" cy="75" r="15"/>
        </svg>
      </td>
      <td data-label="Intuition">Branch if R is not present.</td>
    </tr>
    <tr>
      <th scope="row" data-label="Plus">Plus</th>
      <td data-label="Regex"><code>R+</code></td>
      <td data-label="NFA fragment">
        <svg class="nfa" viewBox="0 0 300 150" role="img" aria-label="Start with R and then go back or go to final state">
          <path class="e" d="M5,75 L28,75"/>
          <path class="e eps" d="M130,75 L210,75"/>
          <path class="e eps" d="M230,55 C185,10 115,10 80,53"/>
          <rect class="box-r" x="30" y="52" width="100" height="46" rx="8"/><text x="80" y="80" text-anchor="middle">R</text>
          <circle class="s" cx="230" cy="75" r="19"/><circle class="s in new" cx="230" cy="75" r="15"/>
        </svg>
      </td>
      <td data-label="Intuition">Traverse R and then repeat or go to final state.</td>
    </tr>
  </tbody>
</table>
<p class="legend">Dashed orange edges are ε-transitions (no input consumed). Solid edges read a symbol. Orange states are the ones the rule adds. Double ring = accept state.</p>
</div>

Maybe the idea can be seen better now. The algorithm recursively builds the NFA by starting from the characters and going up to higher priority operators. This ensures a certain structure that makes the graph have some very nice properties.

So now, the last question that must be answered. We have parsed the expression, and we have built the Automata. But how do we check if a string matches the expression? Now that is the last step.

## Moving through the Automata




## Conclusion

Just to finish off this marvelous post, I want to share a bit of my thoughts. Even though this is a nice review on formal language theory, syntax analysis and regular expressions, most of the regular expression engines are much more complex than this. Take the [re python library](https://docs.python.org/3/library/re.html). This allows for many more operators and things such as backtracking. For those cases, Finite Automatas loose power since they do not have the capabilities to deal with certain operations. However, most of the operations and tools can be implemented using Automatas or ideas from them. Hence, the basis are always nice to know.

## References

<ol>
  <li id="ref1">
  Sipser, M. (2013). Introduction to the theory of computation (Third edition). Cengage Learning.</li>
  <li id="ref2">A. V. Aho, M. S. Lam, R. Sethi, and J. D. Ullman, <em>Compilers: Principles, Techniques, and Tools</em>, 2nd ed. Boston, MA: Addison-Wesley, 2006.</li>
  <li id="ref3">R. Cox, "Regular Expression Matching Can Be Simple and Fast," Jan. 2007. [Online]. Available: <a href="https://swtch.com/~rsc/regexp/regexp1.html">https://swtch.com/~rsc/regexp/regexp1.html</a></li>
</ol>


