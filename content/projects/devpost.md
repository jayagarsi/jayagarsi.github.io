+++
title = "Devpost projects"
date = 2025-03-03
template = "project_page.html"

[extra]
image = "/images/logos/devpost.png"
+++

During my university years I participated in different Hackatons, organized by different organizations. All of the projects are uploaded in my [Devpost repository](https://devpost.com/jaya-garcia). Here I will make a small summary on the three of them.

## [Inditex Visual Search](https://devpost.com/software/inditex-visual-search) 🥈
Winner of the segon prize of the Hackupc, this project uses an API provided by Inditex to search for clothes from a picture taken by a camera. The API gave us acces to the algorithms used by Inditex to find similar clothing. We built an application to make this process. Below you can find a video on how the app looks like. You can also see it on the [Github Repository](https://github.com/aolle99/HackUPC2025).

<div class="video-wrapper">
  <iframe
    src="https://www.youtube-nocookie.com/embed/Vh3CoQwc_Nw"
    title="Usage Showcase"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>

## [Vent i Asfalt](https://devpost.com/software/l-aire-de-les-carreteres)

This project was presented by the Barcelona Supercomputinc Center (BSC). The goal was to implement an application to visualize in real time the quality of the air in a city like Barcelona. We were given a dataset with the measurements of different meteorollogical stations, with values like the quantity of CO^2 measured. Since the data only has some points with the measurements, we had to make an interpolation between different points to compute the values in points where there is no station. Once the interpolation was computed, according to some values we got, we generated an interface to deal with this visualization. Below we have an image of our output. Notice that the devpost of this repository is written in catalan.

<img src="/images/via-mapa.jpg" alt="Heat map" class="devpost-heatmap">

## [McKinsey Forecasting](https://devpost.com/software/mckinsey-ml)

The goal for this project was to develop a forecasting predictor of some internal data. We developed Neural Networks and Supervised Learning techniques to predict some values from the given dataset. For this we used Python and TensorFlow.