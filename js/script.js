'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorsSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudCLassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list-authors';


function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts .active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /*[DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /*[DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */

  const links = document.querySelector(optTitleListSelector);
  const titleList = links;
  titleList.innerHTML = '';

  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles){
  
    /* get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element and get the title from the title element*/

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */

    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */

    html = html + linkHTML;
  } 


  titleList.innerHTML = html;


  const linksTest = document.querySelectorAll('.titles a');
  for(let link of linksTest){
  link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();



function calculateTagsParams(tags){
  const params = {max:0 , min:999999};
  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count , params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage*(optCloudClassCount - 1) + 1);
  const linkTag = optCloudCLassPrefix + classNumber;
  return linkTag;
}
function generateTags(){
  /* create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector); 
  /* START LOOP: for every article: */
  for(let article of articles){

    /* find tags wrapper */

    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */

    let html = " "; 

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */

    for(let tag of articleTagsArray){

      /* generate HTML of the link */

      const linkHTMLData = {id: 'tag-' + tag, title: tag};
      const linkHTML = templates.articleLink(linkHTMLData);
      /* add generated code to html variable */

      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else{
        allTags[tag]++;
      }
    }

    /* insert HTML of all the links into the tags wrapper */

    tagsWrapper.innerHTML = html; 

  /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] create variable for all links HTML code*/
  const tagsParams = calculateTagsParams(allTags);
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    /*[NEW] END LOOP: for each tag in allTags: */
  
  /*[NEW] add html from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log(tagList);
}
generateTags();


function tagClickHandler(event){
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]'); 
  /* START LOOP: for each active tag link */
  for(let tag of activeTagLinks){
    /* remove class active */

    tag.classList.remove('active');

  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */

  for(let tag of tagLinks){
    /* add class active */

    tag.classList.add('active');

  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
/* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(const link of links){
  /* add tagClickHandler as event listener for that link */
  link.addEventListener('click', tagClickHandler);
/* END LOOP: for each link */
} 
} 

addClickListenersToTags();


function generateAuthors(){
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles){
    const authorsWrapper = article.querySelector(optArticleAuthorsSelector);
    let html =" ";
    const articleAuthors = article.getAttribute('data-author');
    const linkHTMLData = {id: 'author-' + articleAuthors, title: articleAuthors};
    const linkHTML = templates.articleLink(linkHTMLData);
    html = html + linkHTML;
    
    if(!allAuthors.hasOwnProperty(articleAuthors)){
      /* [NEW] add tag to allTags object */
      allAuthors[articleAuthors] = 1;
    } else{
      allAuthors[articleAuthors]++;
    }
    authorsWrapper.innerHTML = html;
  }
  const authorList = document.querySelector(optAuthorsListSelector);
  const allAuthorData = {authors: []};

  for (let author in allAuthors) {
    allAuthorData.authors.push({
      author: author,
      count: allAuthors[author],
      className: 'author-' + author
    });
  }
  authorList.innerHTML = templates.authorCloudLink(allAuthorData);
  console.log(authorList);
}

generateAuthors();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  for(let author of activeAuthorLinks){
    author.classList.remove('active');
  }
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for(let author of authorLinks){
    author.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenerToAuthors(){
  const links = document.querySelectorAll('a[href^="#author-"]');
  for(const link of links){
    link.addEventListener('click', authorClickHandler);
  }
}
addClickListenerToAuthors();

