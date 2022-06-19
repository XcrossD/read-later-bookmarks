<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Read Later Bookmarks</h3>

  <p align="center">
    A chrome extension that turns chrome into a read later app with native bookmarks
    <!-- <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br /> -->
    <br />
    <a href="https://chrome.google.com/webstore/detail/read-later-bookmarks/idbfabodbjebjbhimhgfonhhbjlilffb">Chrome web store</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <!-- <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li> -->
    <!-- <li><a href="#usage">Usage</a></li> -->
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Read Later Bookmarks Screen Shot][product-screenshot]

Although I'm an enjoyer of read later apps, I've been finding myself 1. not really wanting to go to their website and 2. saving youtube links which doesn't work well with read later apps. I chose to just bookmark them in chrome instead. As time went on, it gradually became a nightmare to manage all those bookmarks, so I decided to create a chrome extension to provide a read later view to manage those bookmarks.
Hope you enjoy this extension!

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [React.js](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [React Redux](https://react-redux.js.org/)
* [Blueprint JS](https://blueprintjs.com/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
<!-- ## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

<p align="right">(<a href="#top">back to top</a>)</p> -->



<!-- USAGE EXAMPLES -->
<!-- ## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#top">back to top</a>)</p> -->



<!-- ROADMAP -->
## Roadmap

- [x] Manage individual bookmarks
- [x] Search and sort
- [x] Bulk archive and bulk delete
- [x] Export to 3rd party read later apps
    - [x] Pocket
    - [x] Instapaper
- [x] Bulk export
- [ ] Tags
- [x] Combine folders
- [ ] Dev server

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Installation

~~Due to `create-react-app` being a single page application and chrome extension requiring multiple independent HTML files, currently the project is setup as one folder for each HTML file.~~

It is now configured to use a single `package.json` file. Dev server is currently not supported.

* npm
  ```sh
  npm install
  npm run build
  ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Herbert Lin - [LinkedIn](https://www.linkedin.com/in/herbert-lin-28240446/) - herbert.lin.7@gmail.com

Project Link: [https://github.com/XcrossD/read-later-bookmarks](https://github.com/XcrossD/read-later-bookmarks)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* <a target="_blank" href="https://icons8.com/icon/80310/bookmark">Bookmark</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
* [Best README template by othneildrew](https://github.com/othneildrew/Best-README-Template)
* <a href="https://www.flaticon.com/free-icons/pocket" title="pocket icons">Pocket icons created by Pixel perfect - Flaticon</a>
* <a href="https://www.flaticon.com/free-icons/instapaper" title="instapaper icons">Instapaper icons created by pictogramer - Flaticon</a>
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/XcrossD/read-later-bookmarks.svg?style=for-the-badge
[contributors-url]: https://github.com/XcrossD/read-later-bookmarks/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/XcrossD/read-later-bookmarks.svg?style=for-the-badge
[forks-url]: https://github.com/XcrossD/read-later-bookmarks/network/members
[stars-shield]: https://img.shields.io/github/stars/XcrossD/read-later-bookmarks.svg?style=for-the-badge
[stars-url]: https://github.com/XcrossD/read-later-bookmarks/stargazers
[issues-shield]: https://img.shields.io/github/issues/XcrossD/read-later-bookmarks.svg?style=for-the-badge
[issues-url]: https://github.com/XcrossD/read-later-bookmarks/issues
[license-shield]: https://img.shields.io/github/license/XcrossD/read-later-bookmarks.svg?style=for-the-badge
[license-url]: https://github.com/XcrossD/read-later-bookmarks/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/herbert-lin-28240446/
[product-screenshot]: images/screenshot.png
