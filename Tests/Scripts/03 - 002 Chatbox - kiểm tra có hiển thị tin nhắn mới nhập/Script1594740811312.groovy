import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import com.kms.katalon.core.webui.driver.DriverFactory as DriverFactory
import org.openqa.selenium.By as By
import org.openqa.selenium.WebDriver as WebDriver
import org.openqa.selenium.WebElement as WebElement
import org.openqa.selenium.Keys as Keys

WebUI.callTestCase(findTestCase('1612419/03 - 006 Login success (reusable)'), [('url') : 'http://localhost:8065/login', ('username') : 'ntn641998'
        , ('password') : 'Hcmushcmus@123'], FailureHandling.STOP_ON_FAILURE)

WebUI.navigateToUrl(url)

WebDriver driver = DriverFactory.getWebDriver()

WebUI.setText(findTestObject('Dashboard/DIRECT MESSAGES/Chatbox/Input'), content)

eleCountOld = driver.findElements(By.xpath('//div[@class=\'post-list__dynamic\']/div/div')).size()

WebUI.sendKeys(findTestObject('Dashboard/DIRECT MESSAGES/Chatbox/Input'), Keys.chord(Keys.ENTER))

eleCountNew = driver.findElements(By.xpath('//div[@class=\'post-list__dynamic\']/div/div')).size()

recentContent = WebUI.getText(findTestObject('Dashboard/DIRECT MESSAGES/Chatbox/Recently Text Content'))

println(eleCountNew)

println(eleCountOld)

switch (eleCountNew) {
    case eleCountOld:
        throw new Exception('Cannot add message')
    case eleCountOld + 1:
        WebUI.verifyElementText(findTestObject('Dashboard/DIRECT MESSAGES/Chatbox/Recently Text Content'), content)

        break
    default:
        throw new Exception('Some thing wrong')
}

WebUI.closeBrowser()

