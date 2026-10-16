/**
 * Local Test Data
 *
 * Git-tracked snapshot of all Hyundai automation test data, keyed by sheet
 * name exactly as it was on the Confluence "Automation Test Data" page. This
 * is now the sole source of test data for the suite — nothing is fetched
 * from Confluence at test-run time.
 *
 * ROAP admin-portal credentials are intentionally blank here — see
 * ROAP_USERNAME / ROAP_PASSWORD in .env instead of committing secrets to git.
 *
 * To refresh from Confluence (e.g. after someone edits values there), run:
 *   node scripts/refreshLocalTestData.js
 * and re-apply the credential scrub before committing.
 */

export default {
  "Environment Configuration": [
    {
      "TestName": "Dev",
      "Environment": "Dev",
      "URL": "https://dev.hyundai.com.au/au/en",
      "RequiresAuth": "No",
      "Status": "Yes"
    },
    {
      "TestName": "Dev1",
      "Environment": "Dev1",
      "URL": "https://dev1.hyundai.com.au/au/en",
      "RequiresAuth": "No",
      "Status": "No"
    },
    {
      "TestName": "Stage",
      "Environment": "Stage",
      "URL": "https://stage.hyundai.com.au/au/en",
      "RequiresAuth": "No",
      "Status": "No"
    },
    {
      "TestName": "Production",
      "Environment": "Production",
      "URL": "https://www.hyundai.com/au/en/",
      "RequiresAuth": "No",
      "Status": "No"
    }
  ],
  "Environment URLs": [
    {
      "Page": "Home",
      "Dev": "https://dev.hyundai.com.au/au/en",
      "Dev1": "https://dev1.hyundai.com.au/au/en",
      "Stage": "https://stage.hyundai.com.au/au/en",
      "Production": "https://www.hyundai.com/au/en/"
    },
    {
      "Page": "RYI",
      "Dev": "https://dev.hyundai.com.au/au/en/cars/eco/elexio-ryi",
      "Dev1": "https://dev.hyundai.com.au/au/en/cars/eco/elexio-ryi",
      "Stage": "https://stage.hyundai.com.au/au/en/cars/eco/elexio-ryi",
      "Production": "https://www.hyundai.com/au/en/cars/eco/elexio-ryi"
    },
    {
      "Page": "Calculator",
      "Dev": "https://dev.hyundai.com.au/au/en/shop/calculator",
      "Dev1": "https://dev1.hyundai.com.au/au/en/shop/calculator",
      "Stage": "https://stage.hyundai.com.au/au/en/shop/calculator",
      "Production": "https://www.hyundai.com/au/en/shop/calculator"
    },
    {
      "Page": "Find A Dealer",
      "Dev": "https://dev.hyundai.com.au/au/en/find-a-dealer",
      "Dev1": "https://dev1.hyundai.com.au/au/en/find-a-dealer",
      "Stage": "https://stage.hyundai.com.au/au/en/find-a-dealer",
      "Production": "https://www.hyundai.com/au/en/find-a-dealer"
    },
    {
      "Page": "Test Drive",
      "Dev": "https://dev.hyundai.com.au/au/en/book-a-test-drive",
      "Dev1": "https://dev1.hyundai.com.au/au/en/book-a-test-drive",
      "Stage": "https://stage.hyundai.com.au/au/en/book-a-test-drive",
      "Production": "https://www.hyundai.com/au/en/book-a-test-drive"
    },
    {
      "Page": "Quote/Book Service",
      "Dev": "https://dev.hyundai.com.au/au/en/find-a-dealer#service",
      "Dev1": "https://dev1.hyundai.com.au/au/en/find-a-dealer/nsw/rosebery/sydney-city-hyundai#service",
      "Stage": "https://stage.hyundai.com.au/au/en/find-a-dealer#service",
      "Production": "https://www.hyundai.com/au/en/find-a-dealer#service"
    },
    {
      "Page": "Car Models Page",
      "Dev": "https://dev.hyundai.com.au/au/en/cars",
      "Dev1": "https://dev1.hyundai.com.au/au/en/cars",
      "Stage": "https://stage.hyundai.com.au/au/en/cars",
      "Production": "https://www.hyundai.com/au/en/cars"
    },
    {
      "Page": "IONIQ 5N Accessories",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/ioniq5n",
      "Dev1": "https://dev1.hyundai.com.au/au/en/owning/accessories/ioniq5n",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/ioniq5n",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/ioniq5n"
    },
    {
      "Page": "Contact A Dealer",
      "Dev": "https://dev.hyundai.com.au/au/en/contact-a-dealer",
      "Dev1": "https://dev1.hyundai.com.au/au/en/contact-a-dealer",
      "Stage": "https://stage.hyundai.com.au/au/en/contact-a-dealer",
      "Production": "https://www.hyundai.com/au/en/contact-a-dealer"
    },
    {
      "Page": "Contact Us",
      "Dev": "https://dev.hyundai.com.au/au/en/customer-care/contact-us",
      "Dev1": "https://dev1.hyundai.com.au/au/en/customer-care/contact-us",
      "Stage": "https://stage.hyundai.com.au/au/en/customer-care/contact-us",
      "Production": "https://www.hyundai.com/au/en/customer-care/contact-us"
    },
    {
      "Page": "Accessories",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories",
      "Dev1": "https://dev1.hyundai.com.au/au/en/owning/accessories",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories",
      "Production": "https://www.hyundai.com/au/en/owning/accessories"
    },
    {
      "Page": "Book Valuation",
      "Dev": "https://dev.hyundai.com.au/au/en/crm-book-a-valuation",
      "Dev1": "",
      "Stage": "https://stage.hyundai.com.au/au/en/crm-book-a-valuation.html",
      "Production": "https://www.hyundai.com/au/en/crm-book-a-valuation"
    },
    {
      "Page": "Fleet Registration",
      "Dev": "https://dev.hyundai.com.au/au/en/fleet/registration",
      "Dev1": "https://dev1.hyundai.com.au/au/en/fleet/registration",
      "Stage": "https://stage.hyundai.com.au/au/en/fleet/registration",
      "Production": "https://www.hyundai.com/au/en/fleet/registration"
    },
    {
      "Page": "Ownership",
      "Dev": "https://dev.hyundai.com.au/au/en/crm-ownership-update",
      "Dev1": "https://dev1.hyundai.com.au/au/en/crm-ownership-update",
      "Stage": "https://stage.hyundai.com.au/au/en/crm-ownership-update",
      "Production": "https://www.hyundai.com/au/en/crm-ownership-update"
    },
    {
      "Page": "Genesis RYI Page",
      "Dev": "https://dev.genesis-motors.com.au/au/en/models/gv60-magma-teaser.html",
      "Dev1": "",
      "Stage": "https://stage.genesis-motors.com.au/au/en/models/gv60-magma-teaser.html",
      "Production": "https://www.genesis.com/au/en/models/gv60-magma-teaser.html"
    },
    {
      "Page": "Pip Page",
      "Dev": "https://dev.hyundai.com.au/au/en/cars/suvs/kona",
      "Dev1": "https://dev1.hyundai.com.au/au/en/cars/suvs/kona",
      "Stage": "https://stage.hyundai.com.au/au/en/cars/suvs/kona",
      "Production": "https://www.hyundai.com/au/en/cars/suvs/kona"
    },
    {
      "Page": "Offers Detail Page",
      "Dev": "https://dev.hyundai.com.au/au/en/offers/venue/offer-detail?variantId=303",
      "Dev1": "https://dev1.hyundai.com.au/au/en/offers/venue/offer-detail?variantId=306",
      "Stage": "https://stage.hyundai.com.au/au/en/offers/venue/offer-detail?variantId=306",
      "Production": "https://www.hyundai.com/au/en/offers/elexio/offer-detail?variantId=1626"
    },
    {
      "Page": "PIM Hyundai",
      "Dev": "https://stage-pim.hyundai.com.au/",
      "Dev1": "",
      "Stage": "https://stage-pim.hyundai.com.au/",
      "Production": "https://stage-pim.hyundai.com.au/"
    },
    {
      "Page": "ROAP",
      "Dev": "http://hyundai-roap-dev.orchard.net.au",
      "Dev1": "",
      "Stage": "https://stage-roap.hyundai.com.au",
      "Production": ""
    }
  ],
  "Contact Us Form – Test Data": [
    {
      "Title": "Mrs",
      "First Name": "Janki",
      "Last Name": "TheTester",
      "Email Address": "TheTester@orchard.com.au",
      "Phone Number": "0431667796",
      "Postcode": "2000",
      "Own Hyundai": "No",
      "Model Of Interest": "Venue",
      "Enquiry About": "Fleet",
      "Outline Enquiry": "Test",
      "Upload File": ""
    }
  ],
  "Fleet registration - Test Data": [
    {
      "Title": "Mrs",
      "First Name": "Janki",
      "Last Name": "TheTester",
      "Phone Number": "0431667796",
      "Email Address": "TheTester@orchard.com.au",
      "Person Submitting Form Same as Above": "Yes",
      "Position": "Fleet Manager",
      "ABN": "13 069 942 552",
      "Company Name": "Orchard Test Corp",
      "Purchase Category": "Lease",
      "Industry": "Transport & Logistics",
      "Address": "394 Lane Cove Rd, Macquarie Park NSW 2113",
      "Suburb": "Sydney",
      "State": "NSW",
      "Postcode": "2200",
      "Fleet Size": "25",
      "Vehicle Replacement Policy - in months": "36",
      "Vehicle Replacement Policy - in kms": "60000",
      "Consent": "Yes"
    }
  ],
  "Test Drive Form – Test Data": [
    {
      "Model": "KONA",
      "Powertrain": "Hybrid",
      "Set Location": "2000",
      "First Name": "Janki",
      "Last Name": "TheTester",
      "Email Address": "TheTester@orchard.com.au",
      "Phone Number": "0431667796",
      "Purchase": "0-3 Months"
    }
  ],
  "Test Drive FIFO - Test Data": [
    {
      "Model": "KONA",
      "Variant": "KONA Elite",
      "Your Location": "2000",
      "Title": "Ms.",
      "First Name": "Janki",
      "Last Name": "TheTester",
      "Email Address": "TheTester@orchard.com.au",
      "Phone Number": "0431667796",
      "When are you likely to purchase": "0-3 Months"
    }
  ],
  "Test Drive FIFO PCM2 - Test Data": [
    {
      "Model": "KONA",
      "Powetrain": "Petrol",
      "Your Location": "2000",
      "First Name": "Janki",
      "Last Name": "TheTester",
      "Email Address": "TheTester@orchard.com.au",
      "Phone Number": "0431667796",
      "When are you likely to purchase": "0-3 Months",
      "Location": "2000"
    }
  ],
  "Contact A Dealer Form – Test Data": [
    {
      "Model": "VENUE",
      "Powertrain": "Petrol",
      "Title": "Ms",
      "First Name": "Janki",
      "Last Name": "TheTester",
      "Email": "TheTester@orchard.com.au",
      "Phone": "0431667796",
      "Postcode": "2000"
    }
  ],
  "Contact a dealer FIFO - Test Data": [
    {
      "Title": "Ms.",
      "First Name": "Janki",
      "Last Name": "TheTester",
      "Email Address": "TheTester@orchard.com.au",
      "Phone Number": "0431667796",
      "Postcode": "2000",
      "When are you likely to purchase": "0-3 Months",
      "Model of interest": "KONA",
      "Variant": "KONA Elite"
    }
  ],
  "Contact a dealer FIFO PCM2- Test Data": [
    {
      "First Name": "Janki",
      "Last Name": "TheTester",
      "Email Address": "TheTester@orchard.com.au",
      "Phone Number": "0431667796",
      "Postcode": "2000",
      "When are you likely to purchase": "0-3 Months",
      "Model": "KONA",
      "Powertrain": "Hybrid",
      "Location": "2000"
    }
  ],
  "Book a Valuation FIFO - Test Data": [
    {
      "Model": "KONA",
      "Title": "Ms.",
      "First Name": "Janki",
      "Last Name": "TheTester",
      "Email Address": "TheTester@orchard.com.au",
      "Phone Number": "0431667796",
      "What car model are you currently driving": "Venue",
      "Postcode": "2000"
    }
  ],
  "Calculator – Vehicle Test Data": [
    {
      "Vehicle": "venue",
      "Vehicle Type": "Standard",
      "Threshold": "80567",
      "MLP Options On-Road": "27636.47",
      "LCT": "0",
      "Offer": "0",
      "Options": "0",
      "Retail Options": "0",
      "Expected Driveaway": "27636.47"
    },
    {
      "Vehicle": "ioniq-9",
      "Vehicle Type": "Fuel-Efficient",
      "Threshold": "91387",
      "MLP Options On-Road": "129135.97",
      "LCT": "7143.81",
      "Offer": "0",
      "Options": "0",
      "Retail Options": "0",
      "Expected Driveaway": "129135.97"
    }
  ],
  "Ownership - Test Data": [
    {
      "VIN": "KMHDB81SMBU123456",
      "Vehicle model": "i30",
      "Vehicle Description": "FD I30 WG 1.6D SX W CR W BT AUTO",
      "Vehicle Colour": "Sleek Silver",
      "Vehicle Year": "2011",
      "Do you still own this vehicle": "YES",
      "Title": "Ms",
      "Firstname": "Janelle",
      "Lastname": "TheTester",
      "Email": "TheTester@orchard.com.au",
      "Phone": "0412345678",
      "Address": "394 Lane Cove Rd, Macquarie Park NSW 2113",
      "Suburb": "Sydney",
      "State": "NSW",
      "Postcode": "2000"
    }
  ],
  "Book a Service - Test Data": [
    {
      "Rego": "CS39PR",
      "State": "NSW",
      "Model": "2026",
      "Vin": "KMHDB81SMBU123456",
      "Postcode": "2000"
    }
  ],
  "Genesis RYI - Test Data": [
    {
      "Firstname": "John",
      "Lastname": "Smith",
      "Email Address": "TheTester@orchard.com.au",
      "Phone number": "0400000000",
      "Postal Code": "3000",
      "Preferred Contact Method": "Email"
    }
  ],
  "Talk to an expert - Test Data": [
    {
      "Title": "Ms",
      "First Name": "Janki",
      "Last Name": "TheTester",
      "Email Address": "TheTester@orchard.com.au",
      "Phone Number": "0412345678",
      "Reason for your enquiry": "New Cars",
      "Additional information": "testing additional info field",
      "Location": "2000"
    }
  ],
  "PIM and CPC for MLP - Test Data": [
    {
      "Vehicle": "i30 N",
      "PIM Variant": "N Premium w/ Sunroof",
      "PIM_Description": "i30 N Hatch Premium with Sunroof 2.0L Petrol Turbo 6-Speed Manual",
      "Site_Variant": "i30 N Premium with sunroof",
      "Site_Powertrain": "2.0 T-GDi Petrol",
      "Extended Range Option Pack": "NA",
      "Roof Basket Option Pack": "NA",
      "Site_Transmission": "6-Speed Manual FWD",
      "CPC URL": "https://stage.hyundai.com.au/au/en/shop/calculator/i30-n"
    }
  ],
  "Driveaway Price - Test Data": [
    {
      "Page": "ROAP",
      "username": "",
      "password": "",
      "Pim": "1568",
      "postcode": "2000",
      "suburb": "Dawes Point, NSW"
    }
  ],
  "Accessories URLs by Environment": [
    {
      "Model": "KONA",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/kona",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/kona",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/kona"
    },
    {
      "Model": "KONA Electric",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/kona-electric",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/kona-electric",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/kona-electric"
    },
    {
      "Model": "ELEXIO",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/elexio",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/elexio",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/elexio"
    },
    {
      "Model": "TUCSON",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/tucson",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/tucson",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/tucson"
    },
    {
      "Model": "TUCSON Hybrid",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/tucson",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/tucson",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/tucson"
    },
    {
      "Model": "VENUE",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/venue",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/venue",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/venue"
    },
    {
      "Model": "SANTA FE",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/santa-fe",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/santa-fe",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/santa-fe"
    },
    {
      "Model": "PALISADE Hybrid",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/palisade",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/palisade",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/palisade"
    },
    {
      "Model": "INSTER",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/inster",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/inster",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/inster"
    },
    {
      "Model": "IONIQ 9",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/ioniq9",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/ioniq9",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/ioniq9"
    },
    {
      "Model": "i20 N",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/i20-n",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/i20-n",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/i20-n"
    },
    {
      "Model": "i30 N",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/i30-n",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/i30-n",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/i30-n"
    },
    {
      "Model": "i30 Sedan N",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/i30-sedan-n",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/i30-sedan-n",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/i30-sedan-n"
    },
    {
      "Model": "IONIQ 5 N",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/ioniq5n",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/ioniq5n",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/ioniq5n"
    },
    {
      "Model": "STARIA",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/staria",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/staria",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/staria"
    },
    {
      "Model": "IONIQ 5",
      "Dev": "https://dev.hyundai.com.au/au/en/owning/accessories/ioniq5",
      "Stage": "https://stage.hyundai.com.au/au/en/owning/accessories/ioniq5",
      "Production": "https://www.hyundai.com/au/en/owning/accessories/ioniq5"
    }
  ]
};
