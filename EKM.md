# Issues with EKM

### Developing

This is the biggest positive of moving away from EKM, in the long term this WILL save time.

- For self hosting we can locally store the products sheet.
  - Making changing the products in bulk simpler
- Automation through code will be much easier.
  - Not having to deal with EKMs API's allows simple integration of:
    - Automatic price updating
    - Automatic product availability editing
    - Integrating with other scripts I have already wrote for the company.
- Self coding allows extremely context specific data mining.

### Speed

- EKM deploys dynamic websites which are inherently slower for loading
  - With code, instead of compiling the site when a user clicks it, we can compile it once and send the user the full site.
  - [Loading a site in >= 3 seconds loses 53% of customers](https://websitespeed.uk/30-website-speed-statistics-which-impact-your-website/)
    - Self code will never be anywhere close to a megabyte, in the UK the average internet speed is 100s of megabytes per second.

### Customisability

- Needing to contact EKM for major changes takes time.
- Manual editing is harder and slower with the EKM GUI than with code.
- Implementing salesfires' features is behind a paywall on EKM, whereas most their features are a single line of code.
- Much more control over styling of the site, so it doesn't look generic.

### Concerns

EKM is good for providing SEO, tracking and styling, but lacks the control over the internal functionality which can allow the business to run more automated in the near future.
By moving away from EKM we will not be starting from 0, as half the challenge of website development is design. To get to the stage the current EKM site is at may not even take a week.
Handling payments securely can be done via stripe, which EKM does themselves.
Tracking customers via cookies to display suggestions, show previously viewed products or track their basket without an account is easy enough to make.

# TLDR

In my professional opinion, EKM provides no major benefits, beyond being possible to edit with zero coding knowledge.
But in 2026, resources for learning HTML/CSS are more than plentiful, and AI can be used for simple changes, perhaps being easier than editing with EKM.
EKM takes a pay cut, which can be partially or fully negated.
Automation that would be difficult or impossible with EKM becomes trivial in code.
By coding the site ourselves, any data you wish for can be easily tracked and accessed.