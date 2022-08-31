# STEM_Tutor_Pay
### This Project was created to support STEM Tutoring Center
- A simple Javascript application to display wages for STEM tutor based on qualifications of certification, years of experience and degree. 
> The stakeholder and point of contact for the application is Hernán Pinto Zambrano <hpintoza@slcc.edu>
---
- The source data for this application is a json file on github
- Recieve the pay rate information from stakeholder then save that information as a csv
- Add sorting to the file
- Convert the csv to json using this webpage https://raw.githubusercontent.com/SLCC-DSA/stem-tutor-pay/master/pay_rate_data.json
- Ensure that all the less than and greater than cheverons are correct
- Save the file in git hub and publish to master and gh-pages branch
- Get the raw URL of the file 
- Use the raw url of the file on the fetch javascript function

```mermaid
graph TD;
    Excel File-->CSV File;
    CSV File-->JSON File;
    JSON File-->Javascript_Fetch;
    Javascript_Fetch-->JSON;
    JSON-->Filtered;
    Filtered-->HTML;
```