---
title: "Prediction Orthogonality and the Voices in Your Head"
subtitle: "When Mechanistic Interpretability Meets Computational Psychiatry"
date: 2026-03-30
authors:
  - "Tom Pelletreau-Duris"
tags: [mechanistic interpretability, computational psychiatry, predictive processing, schizophrenia, superposition, AI safety]
section: "AI and philosophy"
draft: false
---

# Prediction Orthogonality and the Voices in Your Head

## When Mechanistic Interpretability Meets Computational Psychiatry

---

What if the same geometric principle that explains why language models can simulate deceptive agents also explains why some brains hear voices?

This post connects three threads: a hypothesis from mechanistic interpretability about how predictive models host internal agents, a recent genetics paper on schizophrenia, and Scott Alexander's elegant tradeoff-versus-failure framework for psychiatric conditions. The punchline is that prediction orthogonality — a concept from AI safety — might offer a computational-level explanation for psychotic phenomenology, and that the tradeoff/failure duality maps cleanly onto the two-factor structure of schizophrenia risk.

---

## The Setup: Prediction Orthogonality in Language Models

In their comprehensive review of mechanistic interpretability, Bereska and Gavves (2024) present the **prediction orthogonality hypothesis**: a model trained on prediction can simulate agents pursuing *any* objectives with *any* degree of optimality. The simulator and its simulacra are decoupled — the model's training loss lives in one subspace, while the simulated agents' goals occupy orthogonal subspaces.

The linear-algebraic picture is clean. A transformer's residual stream is a vector $h \in \mathbb{R}^d$. Features — the fundamental units of representation — correspond to directions in this space. The linear representation hypothesis says these features are encoded as linear combinations of neurons. Under superposition, a $d$-dimensional space can host $\propto \exp(d)$ nearly orthogonal directions, which means the model can represent exponentially more features (including agent-like computations) than it has neurons.

Now consider the space of possible agent-objectives the model can instantiate. Let $\mathbf{e}_{\text{pred}}$ be the direction corresponding to the model's own training objective (next-token prediction), and let $\mathbf{o}$ be the objective vector of some simulacrum. Decompose:

$$\mathbf{o} = \text{proj}_{\mathbf{e}_{\text{pred}}}(\mathbf{o}) + \mathbf{o}_{\perp}$$

Prediction orthogonality claims that $\mathbf{o}_{\perp}$ can be arbitrarily large and point in any direction. The simulator doesn't share objectives with its simulacra. A helpful assistant and a scheming optimizer occupy independent subspaces, and which one gets instantiated depends on the conditioning context — the prompt — not on any built-in alignment.

This is what makes the hypothesis important for AI safety: you cannot infer the safety of the outputs from the safety of the training objective.

---

## The Transposition: Prediction Orthogonality in the Brain

Now consider the cortex. Under predictive processing frameworks (Friston's active inference, Clark's predictive mind), the brain is fundamentally a prediction engine — it minimizes prediction error across sensory and interoceptive streams. The brain's latent space is extraordinarily high-dimensional: tens of billions of synaptic weights parameterize the internal generative model.

If we take the geometric argument from MI seriously, then by the same logic that applies to transformers, a sufficiently high-dimensional predictive system can host multiple quasi-independent internal models — call them internal simulacra — in approximately orthogonal subspaces of its representational space.

In healthy cognition, a binding mechanism (attention, executive control, thalamocortical gating) maintains coherence. It ensures one dominant simulacrum at a time — your unified sense of selfhood, your stable model of "who is thinking right now." You can model other agents (theory of mind), entertain counterfactuals, hold competing perspectives — but these remain clearly tagged as *simulations*, distinct from *self*.

**Schizophrenia, in this framing, is a failure of that binding.**

The orthogonal subspaces start speaking simultaneously. The gating mechanism that normally suppresses or integrates competing simulacra breaks down. What results is precisely the phenomenology of psychosis:

- **Auditory hallucinations** as inner simulacra whose outputs leak into the perceptual stream — internal predictions misattributed to external sources.
- **Thought insertion** as the misattribution of one internal agent's computations to an external agent — a failure to correctly label which subspace generated the thought.
- **Paranoid ideation** as over-activated agent-modeling in the theory-of-mind subspace — the system generates too many agentic simulacra with adversarial objectives.
- **Disorganized thought** as cross-talk between insufficiently orthogonal subspaces — the interference cost of superposition becoming too high.

---

## The Two Factors: Tradeoff and Failure

This is where Scott Alexander's recent post, *How Natural Tradeoff and Failure Components?*, sharpens the picture. Alexander discusses new genetics research showing that schizophrenia risk decomposes into two components:

1. **A component shared with bipolar disorder**, associated with *higher* educational attainment — likely linked to creativity, motivation, or cognitive flexibility.
2. **A component not shared with bipolar**, associated with *lower* IQ — likely reflecting deleterious mutations in neurodevelopmental genes.

Alexander frames this through his earlier tradeoff-versus-failure model of psychiatric conditions. The first component is a *tradeoff*: you get more of something valuable (creativity, divergent thinking) at the cost of increased psychosis risk. The second is a *failure*: something simply goes wrong, with no compensating advantage.

Now map this onto prediction orthogonality:

**The tradeoff component** corresponds to a system that is *more richly multi-agent internally* — more simulacra, more loosely bound, more degrees of freedom in the latent space. This is what gives humans their extraordinary cognitive flexibility: the ability to model other minds, to hold multiple hypotheses simultaneously, to recombine ideas creatively. A brain with more active orthogonal subspaces is a more creative brain — but it's also closer to the threshold where simulacra start competing for dominance. This is the first genetic factor: higher education, higher creativity, higher psychosis risk.

**The failure component** corresponds to degraded binding or gating mechanisms — the neural circuitry that normally prevents cross-talk between orthogonal subspaces. When this breaks, the approximately-orthogonal representation collapses: features that should be independent start interfering, internal agents that should be suppressed start broadcasting. This is the second genetic factor: worse neurodevelopment, lower IQ, no compensating benefit.

The two-factor model of schizophrenia thus maps onto a two-factor model of prediction orthogonality:

| | Tradeoff (Factor 1) | Failure (Factor 2) |
|---|---|---|
| **What it does** | Increases dimensionality of internal agent-space | Degrades the coherence/gating mechanism |
| **Genetic correlate** | Shared with bipolar; ↑ education | Not shared; ↓ IQ |
| **Benefit** | Creativity, cognitive flexibility, theory of mind | None |
| **Risk** | More simulacra → closer to interference threshold | Cross-talk between subspaces → psychotic symptoms |

---

## Caveats and Tensions

This analogy is productive, but it is an analogy. Several tensions are worth flagging.

**Linearity.** The subspace picture relies on the linear representation hypothesis holding at least approximately. In transformers, there is substantial empirical evidence for this (word embedding arithmetic, successful linear probing, sparse dictionary learning). In the brain, the neural code may not be linear enough for the subspace picture to hold cleanly. Though it's worth noting that linear decoding from neural populations is remarkably effective across neuroscience — it's the workhorse of BCI research.

**Phenomenology.** In the LLM case, there is no "what it's like" to host multiple simulacra. In schizophrenia, the subjective dimension — *hearing voices*, *feeling controlled* — is precisely what makes it pathological. The computational analogy explains the *structure* of the failure but not why certain subspace leakages are experienced as alien rather than as ordinary competing thoughts (which everyone has). Something about source-monitoring or metacognitive tagging must be doing additional work.

**Pharmacology.** This framing is closer to predictive processing accounts of schizophrenia (Corlett, Frith, Fletcher) than to classical dopamine models. Antipsychotics work primarily by blocking D2 receptors. Any computational account needs to explain why modulating dopamine fixes (or at least suppresses) the cross-talk. One possibility: dopamine modulates the precision-weighting of predictions, and D2 blockade effectively turns down the gain on aberrant internal predictions — suppressing the rogue simulacra without eliminating them.

**Empirical grounding.** The strongest version of this claim would require showing that, in neuroimaging data, schizophrenia is associated with measurable changes in the geometry of neural representations — less orthogonality between functional subspaces, more interference, more superposition. This is, in principle, testable with the right combination of fMRI functional connectivity analysis and representational geometry methods.

---

## Why This Matters

The connection between prediction orthogonality and psychosis is not just a metaphor. It suggests a specific computational-level hypothesis: *schizophrenia involves a breakdown in the approximate orthogonality of internal predictive subspaces*, and this breakdown has two independent causes (richer agent-space and degraded binding) that map onto the two genetic components identified in recent research.

For AI safety, it's a reminder that prediction orthogonality isn't just a theoretical curiosity about language models. It describes a general property of high-dimensional predictive systems — biological or artificial — and the failure modes it predicts (competing agents, misattributed computations, loss of coherence) have real analogs in the most studied predictive system we know: the human brain.

For computational psychiatry, it offers a bridge between the mathematical toolkit of mechanistic interpretability (superposition, linear representations, feature disentanglement, sparse autoencoders) and the phenomenology of psychosis. If the same geometric principles govern how transformers and brains represent multiple agents, then tools developed for one might illuminate the other.

And for anyone who has ever wondered what it would feel like to be a language model hosting multiple simulacra at once — well, unfortunately, some people already know.

---

As Foucault was saying : the mad subject, after all, was never the one who lacked reason — but the one in whom too many reasons competed for the status of truth. Source : Michel Foucault, Histoire de la folie à l'âge classique (Madness and Civilization), originally published in 1961 under the full title Folie et Déraison: Histoire de la folie à l'âge classique.

## References

Bereska, L., & Gavves, E. (2024). Mechanistic Interpretability for AI Safety — A Review. *arXiv preprint arXiv:2404.14082*. [https://arxiv.org/abs/2404.14082](https://arxiv.org/abs/2404.14082)

Alexander, S. (2026). How Natural Tradeoff and Failure Components? *Astral Codex Ten*. [https://www.astralcodexten.com/p/how-natural-tradeoff-and-failure](https://www.astralcodexten.com/p/how-natural-tradeoff-and-failure)

Alexander, S. (2021). Ontology of Psychiatric Conditions. *Astral Codex Ten*. [https://www.astralcodexten.com/p/ontology-of-psychiatric-conditions-653](https://www.astralcodexten.com/p/ontology-of-psychiatric-conditions-653)

janus. (2022). Simulators. *LessWrong*. [https://www.lesswrong.com/posts/vJFdjigzmcXMhNTsx/simulators](https://www.lesswrong.com/posts/vJFdjigzmcXMhNTsx/simulators)

Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience*, 11(2), 127–138.

Corlett, P. R., Horga, G., Fletcher, P. C., Alderson-Day, B., Schmack, K., & Powers, A. R. (2019). Hallucinations and strong priors. *Trends in Cognitive Sciences*, 23(2), 114–127.