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
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser('')

WebUI.navigateToUrl('http://uberfortutor-react-staging.herokuapp.com/')

WebUI.click(findTestObject('Object Repository/Page_Gia S/b_Xem tt c k nng'))

WebUI.setText(findTestObject('Object Repository/Page_Gia S/input_Tr thnh gia s_search'), 'tiếng anh')

WebUI.sendKeys(findTestObject('Object Repository/Page_Gia S/input_Tr thnh gia s_search'), Keys.chord(Keys.ENTER))

WebUI.click(findTestObject('Object Repository/Page_Gia S/div_Nguyn Vn CGio vin ting Anh80000h NngTin_1a7be8'))

//WebUI.click(findTestObject('Object Repository/Page_Gia S/div_L Vn Fkim ton vin300000h NngTing AnhThn_d04cdd'))
//
//WebUI.click(findTestObject('Object Repository/Page_Gia S/div_Nguyn Ngc HGio vin ton250000hQun Th c T_9eac4e'))
//
//WebUI.click(findTestObject('Object Repository/Page_Gia S/div_Trung NghaGio vin vn hc50000hsai Chi Mi_dabfa5'))
WebUI.closeBrowser()

