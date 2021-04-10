# Ceo Pay Interactive

I worked with a fellow intern to create an interactive of the top CEOs in the Dallas Fort-Worth area. I taught myself to use Python/Pandas so I could perform data analysis and provide him with numbers for his story. 

- [Interactive](https://interactives.dallasnews.com/2018/dfw-top-ceos/)
- [Data Analysis](https://github.com/alma19/dmnprojects/blob/master/ceo-analysis/ceo-numbers.ipynb)

![ceopay1](https://github.com/alma19/ceopay/blob/master/ceopay1.png?raw=true)
![ceopay2](https://github.com/alma19/ceopay/blob/master/ceopay2.png?raw=true)

This is an interactive presentation graphic built using the [`dmninteractives` Yeoman generator](https://github.com/DallasMorningNews/generator-dmninteractives).

## Requirements

- Node - `brew install node`
- Gulp - `npm install -g gulp-cli`

## Local development

#### Installation

1. `npm install` to install development tooling
2. `gulp` to open a local development server

#### What's inside

- `src/index.html` - HTML markup, which gets processed by Nunjucks
- `src/js/*.js` - Graphic scripts, written in ES2015 (it'll be transpiled with Babel)
- `src/scss/*.scss` - Graphic styles in SCSS
- `src/data/*` - files that should be both published and committed to the repository (probably CSVs, JSON, etc.); copied to `dist/data/*` by Gulp
- `src/assets/*` - assets (probably media assets, such as Illustrator files) that don’t get copied by Gulp but are tracked by `git`
- `dist/*` - All of the above, transpiled

_Important caveat:_ Video, audio and ZIP files are ignored by `git` regardless of where they're saved. You'll need to manually alter the [`.gitignore`](.gitignore) file to have them committed to Github.

#### Publishing

`gulp publish` will upload your [`dist/`](dist/) folder to the `2018/ceo-pay/` folder on our interactives S3 bucket.

## Copyright

&copy;2018 The Dallas Morning News
