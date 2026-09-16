# Issues with EKM

### Cost

* EKM does not have set-in-stone pricing; they charge on a per-case basis, with earning limits based on tiers.

  * For the Advanced tier, which we would need, it costs **£200/month on average** according to [G2](https://www.g2.com/products/ekm/pricing).
  * That same source claims the Standard tier is £70/month, despite us currently paying £110.
* If I code the site ourselves and host it through Cloudflare, the **website hosting itself can have effectively no recurring cost** on Cloudflare's free infrastructure. The remaining basic cost would be the domain, likely around **£8/year**, although potentially less; Billericay Chill, for example, costs £1/year.
* Time I spend contacting EKM is time that can instead be spent creating and improving the website ourselves.
* Despite having spent **£10,000 on EKM already**, there has been very little progress on the site.

  * Continuing to invest time and money into EKM therefore has an ongoing opportunity cost, even in the short term.

### Developing

This is the biggest positive of moving away from EKM. In the long term, **this will save time**.

* We can locally store the products database.

  * Making changes to products in bulk becomes simple.
* Automation through code will be much easier.

  * Not having to work through EKM's API and data model allows simple integration of:

    * Automatic price updating
    * Automatic product availability editing
    * Integration with other scripts I have already written for the company
  * Instead of our internal systems having to communicate with EKM's API, they can work directly with our own product data.
  * This removes API requests, authentication, API limitations and EKM-specific data handling from processes that could otherwise be performed locally.
* Self-coding allows extremely context-specific data mining and automation.

  * We can access and process our own data in whatever way is useful to the business, rather than being limited by the data EKM exposes through its systems.

### Speed

* EKM deploys dynamically generated websites.

  * A self-hosted site can instead use a **static-first architecture**.
  * Pages that don't require real-time data can be generated in advance and served directly through a CDN.
  * This avoids unnecessary server-side processing for static pages and gives us much greater control over:

    * Page weight
    * Caching
    * JavaScript
    * Image optimisation
    * Fonts
    * Core Web Vitals
* Static files can be extremely small and can be delivered directly from Cloudflare's edge network, without requiring the application to generate the page for every visitor.
* This gives us the ability to optimise the website specifically for performance rather than being constrained by the architecture of the EKM platform.
* [Loading a site in ≥3 seconds loses 53% of customers](https://websitespeed.uk/30-website-speed-statistics-which-impact-website/).

### Customisability

* Needing to contact EKM for major changes takes time.

  * Even in the short term, switching could save time, as contacting EKM for everything we need is an unnecessary time cost.
  * Manual editing is harder and slower with the EKM GUI than with code, even without coding experience.
* Salesfire's features are behind a paywall on EKM, whereas many of the individual features can be implemented directly with standard web technologies.
* We would have much more control over the styling and functionality of the site, meaning it does not have to conform to the generic structure of an ecommerce platform.

### Concerns

* EKM is good at providing a ready-made ecommerce platform, including SEO, tracking, payments and a relatively simple way to get a shop online.
* However, it gives us significantly less control over the **internal functionality and data** of the business.
* By moving away from EKM we will not be starting from zero. Half the challenge of website development is design, and the existing site already provides a clear specification for how the website should look and function.

  * Reaching the visual stage of the current EKM site may not even take a week.
  * The larger task is implementing the ecommerce functionality underneath it, rather than designing the pages themselves.
* Much of the functionality EKM provides can be implemented using established services and standard web technologies.

  * For example, Stripe provides payment infrastructure, removing the need for us to handle raw card details ourselves.
  * Functionality such as recently viewed products, anonymous baskets and product recommendations can be implemented directly in our application.
* The draw of EKM is that it should be quick to set up a shop, but what we want is a **whole website**, where each additional page and business-specific feature becomes a large project.
* Another draw of EKM is that you can edit text without coding knowledge. However, because the editor largely limits what can be changed to text and basic content, it is not particularly useful for the level of control we need.

  * Editing text with code will not be a significant problem.
  * Products can be edited through Excel, which is a familiar interface for the business.
  * Pages can be edited directly in a text editor.
  * Code also gives us version control, allowing changes to be tracked, tested and reverted.

# TLDR

In my professional opinion, **EKM is no longer providing enough value for the way we want to develop the website**.

It provides a ready-made ecommerce platform, but we increasingly need a system built around our own business processes rather than a general-purpose ecommerce platform.

The current EKM site can be recreated without starting from zero, while the underlying functionality can be built using established technologies and services.

The ongoing cost of EKM can largely be replaced by low-cost infrastructure, while the development time currently spent working around EKM can instead be spent directly improving the website.

Most importantly, automation that is difficult or impossible when working through EKM's systems becomes straightforward when we control the application and the underlying data.

By coding the site ourselves, **we control the data, the functionality and the way the website integrates with the rest of the business**.
