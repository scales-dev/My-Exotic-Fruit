# Issues with EKM

### Cost

- EKM does not have set in stone pricing, they charge on a per case basis. With earning limits based on tiers.
  - For the Advanced tier which we would need [it costs £200/month on average](https://www.g2.com/products/ekm/pricing).
  - Although that site also claims standard tier is £70/month, despite us paying £110.
- If I code the site there will be a low cost of whatever the domain costs, likely ~£8/year, although possibly less, Billericay Chill is £1/year.
- Time I spend contacting EKM is time that can be spent creating the website on my own.
- Despite having spent £10,000 on them already, there has been very little progress on the site.
  - Continuing to invest in EKM will be more costly even in the short term.

### Developing

This is the biggest positive of moving away from EKM, in the long term this WILL save time.

- For self hosting we can locally store the products sheet.
  - Making changing the products in bulk simple
- Automation through code will be much easier.
  - Not having to deal with EKMs API's allows simple integration of:
    - Automatic price updating
    - Automatic product availability editing
    - Integrating with other scripts I have already wrote for the company.
  - Not having to deal with EKM's API's will make any code related to our products run much faster.
- Self coding allows extremely context specific data mining.

### Speed
- EKM deploys dynamic websites. 
  - A self-hosted site can instead use a static-first architecture
  - This allows pages that don't require real time data to be generated in advance and served directly through a CDN.
  - This gives us much greater control over page weight, caching, JavaScript, image optimisation and Core Web Vitals.
  - [Loading a site in >= 3 seconds loses 53% of customers](https://websitespeed.uk/30-website-speed-statistics-which-impact-your-website/)

### Customisability

- Needing to contact EKM for major changes takes time.
  - Even in the short term, switching could save time, as contacting EKM for everything we need is an unnecessary time cost.
  - Manual editing is harder and slower with the EKM GUI than with code, even without coding experience.
- Implementing salesfires' features is behind a paywall on EKM, whereas most their features are a single line of code.
- Much more control over styling of the site, so it doesn't look generic.

### Concerns

- EKM is good for providing SEO, tracking and styling, but lacks the control over the internal functionality which can allow the business to run more automated in the near future.
- By moving away from EKM we will not be starting from 0, as half the challenge of website development is design. To get to the stage the current EKM site is at may not even take a week.
- Much of the functionality EKM provides can be implemented using established services and standard web technologies. 
  - For example, Stripe provides payment infrastructure, which is what EKM uses anyway.
  - Functionality such as recently viewed products, anonymous baskets and product recommendations can be implemented directly in our application.
- The draw of EKM is that it should be quick to set up a shop, but what we want is a whole website, where each other page is a large project.
- Another draw of EKM is that you can edit the text without coding knowledge, but, with the fact you cannot do anything other than edit text, the editor is almost useless.
  - It will not be a struggle to edit the text with code, in fact it could be easier as you can edit products with excel which you are familiar with, and edit pages in a text editor.

# TLDR

In my professional opinion, EKM provides no major benefits, and provides a lower quality website than I could deliver, while being more expensive.
In 2026 you can use AI for simple changes to the site, which is even easier than editing with EKM.
EKM has a cost to stay with, which can be partially or fully negated.
Automation that would be difficult or impossible with EKM becomes trivial in code.
By coding the site ourselves, any data you wish for can be easily tracked and accessed.