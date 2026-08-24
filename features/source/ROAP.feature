Feature: Verify ROAP and CPC pricing using PIM
  As an admin user
  I want to fetch the Driveaway Price test data from the Confluence "Automation Test Data" page,
  And capture the MLP and Driveaway price from the ROAP admin portal by the Pim value,
  And verify the same values are returned by the Hyundai Calculator (CPC) pricing API
  So that I can ensure price consistency between ROAP and CPC

  # The Pim value is the ONLY vehicle key in the test data. Nothing else about
  # the vehicle is read from the sheet — there is no CPC URL and no model
  # column. Both are derived at run time:
  #   Pim -> the ROAP Offers row -> that row's Model cell -> calculator slug
  #          ("KONA (SX2)" -> kona, "SANTA FE" -> santa-fe)
  # The ROAP and calculator base URLs come from the Confluence "Environment
  # Configuration" table for the active environment, so this scenario runs
  # against Dev / Stage / Prod with no change.

  Background:
    Given I load the Driveaway Price test data

  @DriveawayPrice
  Scenario: Verify MLP and Driveaway Price between ROAP and CPC

    # ROAP — URL comes from Environment Configuration (Page = ROAP)
    Given I open the ROAP URL from test data
    When I login using the username and password from test data
    And I retrieve the Pim value from test data
    # Matches the Offers table row on its Pim column and remembers that row's Model
    And I search the vehicle using Pim value
    And I capture the MLP from ROAP
    And I capture the Driveaway Price from ROAP

    # CPC — URL is built as <environment calculator base>/<model slug from ROAP>,
    # NOT read from the test data
    When I open the CPC URL from test data
    # Postcode comes from the test data; the suburb is the first lookup result
    And I set the dealer using the postcode and suburb from test data
    # Walks the variant / powertrain / transmission / option-pack combinations
    # until a variantpricecalculator response carries the matching "pimId".
    # Only three fields are read from that response:
    #   pimId               -> matched against the test-data Pim
    #   mlpFromPIM (or mlp) -> the MLP compared below
    #   finalDriveAwayPrice -> the Driveaway compared below
    And I locate the vehicle whose Pim value matches
    Then I verify the CPC mlpFromPIM matches the ROAP MLP
    # Compares the ROAP Driveaway against "finalDriveAwayPrice".
    # ("price" / "priceEstimate" are dead names from the old carpricecalculator
    #  endpoint and survive only in step names and assertion messages.)
    And I verify the CPC finalDriveAwayPrice matches the ROAP Driveaway Price
