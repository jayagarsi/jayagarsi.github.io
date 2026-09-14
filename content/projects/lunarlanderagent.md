+++
title = "Agent for a Lunar Landing"
date = 2026-05-01
template = "project_page.html"

[extra]
repo_url = "https://github.com/jayagarsi/RL-Agent-LunarLander"
image = "/images/landed-ship.png"
+++

This project is a minimal agent trained to land a space ship at the moon. It was developed in the context of the Machine Learning subject at TU Wien. The environment is implemented by [Gymnasium](https://gymnasium.farama.org/) and is part of the Box2D environments. More details on the observation space, actions and rewards can be checked in the [Lunar Landing page](https://gymnasium.farama.org/environments/box2d/lunar_lander/). For the subject competition, the environment is set to have stronger wind and lower gravity, to make it slightly harder. My agent scored 271.20 points in the competition.

<div class="landing-videos">
    <video controls loop="" muted="" autoplay="">
        <source src="/videos/eval-episode-19.mp4" />
    </video>
</div>

The agent has been trained with an Actor-Critic algorithm. There are two MLPs being trained, one that learns the policy that minimizes the loss, and the other learning the value of a set of actions. To improve the scoring of the agent, I applied different optimizations and improvements:
- **[Generalized Advantage Estimator (GAE)](https://arxiv.org/pdf/1506.02438)**: stabilizes the variance-bias trade-off of the full Montecarlo estimate and the full TD error estimate.
- **[Proximal Policy Optimization (PPO)](https://en.wikipedia.org/wiki/Proximal_policy_optimization)**: minimizes deviations between consecutive policies.
- **Clipping of Gradient Norm**: avoids large gradient spikes to affect the advantage estimation.
- **Execution of multiple gradients over the same buffer**: multiple runs of the forward pass improves the learning and does not add a significant cost.

Below you can see more examples of the agent landing the ship.

<div class="landing-videos">
    <video controls loop="" muted="" autoplay="">
        <source src="/videos/eval-episode-7.mp4" />
    </video>
    <video controls loop="" muted="" autoplay="">
        <source src="/videos/eval-episode-10.mp4" />
    </video>
    
</div>


