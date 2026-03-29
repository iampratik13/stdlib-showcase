# stdlib numerica

`stdlib numerica` is an interactive browser-based platform for exploring the [stdlib](https://stdlib.io) project's numerical computing and scientific capabilities. It provides a visual explorer for mathematical functions, statistical distributions, and high-performance linear algebra operations directly in the browser, powered by Next.js.

## Features

- **Statistical Distributions:** Explore Probability Density Functions (PDF) and Cumulative Distribution Functions (CDF) for Normal, Exponential, Beta, Gamma, Chi-squared, and Uniform distributions.
- **BLAS Operations:** Interactive demonstrations of Level 1 and Level 2 Basic Linear Algebra Subprograms (DGEMV, DAXPY, DDOT, DSCAL, DNRM2).
- **LAPACK Operations:** Real LAPACK routines demonstrated, allowing for matrix permutations, scaling norms, tridiagonal factorizations, and machine parameters retrieval.
- **Special Functions:** Visualizations of Gamma, Beta, Bessel J_0/J_1, Error function, Sigmoid, and Sinc functions.

## Tech Stack

- **Next.js** (App Router)
- **React 19** 
- **Chart.js** & `react-chartjs-2` for interactive data visualizations
- **@stdlib**: Scientific computing standard library for JavaScript & Node.js

## Getting Started

First, ensure you have Node.js installed. Then, clone the repository and install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the interactive modules in action.

## Deployment Ready

This application uses the `next build` command to generate static or optimized server production builds, and is specifically structured with a `vercel.json` and customized `next.config.mjs` for seamless deployment to Vercel/similar Node.js environments.

To deploy simply run:

```bash
npx vercel deploy
```

*(You can also connect it to Vercel via GitHub, GitLab, or Bitbucket for automatic continuous deployments).*
