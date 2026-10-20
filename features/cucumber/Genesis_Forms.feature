@Genesis @FormValidation @AllFieldsFilled @Positive
Feature: Genesis Forms - Submit with all fields shows Thank you

  Background:
    Given I am a user on the Genesis website

  @BATD
  Scenario: BATD - All fields filled succeeds
    Given the user has loaded the test data from the confluence page "Automation Test Data" and find the test data "Genesis BATD - Test Data"
    Given I navigate to "Genesis BATD"
    And I set my retail outlet for postcode "2000"
    When I fill in all required fields from test data
    And I click Submit
    Then I should see "Thank you" success message
    And I should NOT see "Sorry, something went wrong"
    And I should NOT see any validation errors

  @GeneralEnquiry
  Scenario: General Enquiry - All fields filled succeeds
    Given the user has loaded the test data from the confluence page "Automation Test Data" and find the test data "Genesis General Enquiry - Test Data"
    Given I navigate to "Genesis General Enquiry"
    And I set my retail outlet for postcode "2000"
    When the user selects "Product" from "Type of Sub Enquiry" dropdown
    And I fill in all required fields from test data
    And I click Submit
    Then I should see "Thank you" success message
    And I should NOT see "Sorry, something went wrong"
    And I should NOT see any validation errors

  @DownloadEBrochure
  Scenario: Download E-Brochure - All fields filled succeeds
    Given the user has loaded the test data from the confluence page "Automation Test Data" and find the test data "Genesis Download E-Brochure - Test Data"
    Given I navigate to "Genesis Download E-Brochure"
    And I set my retail outlet for postcode "2000"
    When I fill in all required fields from test data
    And I click Submit
    Then I should see "Thank you" success message
    And I should NOT see "Sorry, something went wrong"
    And I should NOT see any validation errors

  @BookAService
  Scenario: Book a Service - All fields filled succeeds
    Given the user has loaded the test data from the confluence page "Automation Test Data" and find the test data "Genesis Book a Service - Test Data"
    Given I navigate to "Genesis Book a Service"
    And I set my retail outlet for postcode "2000"
    When I fill in all required fields from test data
    And I click Submit
    Then I should see "Thank you" success message
    And I should NOT see "Sorry, something went wrong"
    And I should NOT see any validation errors

  @Subscribe
  Scenario: Subscribe - All fields filled succeeds
    Given the user has loaded the test data from the confluence page "Automation Test Data" and find the test data "Genesis Subscribe - Test Data"
    Given I navigate to "Genesis Subscribe"
    And I set my retail outlet for postcode "2000"
    When I fill in all required fields from test data
    And I click Submit
    Then I should see "Thank you" success message
    And I should NOT see "Sorry, something went wrong"
    And I should NOT see any validation errors

  @RYI
  Scenario: RYI - All fields filled succeeds
    Given the user has loaded the test data from the confluence page "Automation Test Data" and find the test data "Genesis RYI Form - Test Data"
    Given I navigate to "Genesis RYI Page"
    And I set my retail outlet for postcode "2000"
    When I fill in all required fields from test data
    And I click Submit
    Then I should see "Thank you" success message
    And I should NOT see "Sorry, something went wrong"
    And I should NOT see any validation errors