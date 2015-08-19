# iep-printing

iep-printing is the customization plugin for PowerSchool that works with [iep-printing-php](https://github.com/IronCountySchoolDistrict/iep-printing-php) to bring printing of PDFs to Form Builder forms.

## Installation

iep-printing is installed like any other customization plugin to PowerSchool. Download `archive.zip` from the [releases page](https://github.com/IronCountySchoolDistrict/iep-printing/releases) and upload it on the PowerSchool customization plugin management page.

### Setup

Open `iep.js` and change the api url at the top to point to where you installed iep-printing-php.
Open the other two javascript files and edit the URLs toward the top of the page to point to where `iep.js` (if you installed this with the zip, this means removing the domain portion e.g. `https://ourdomainname.org` otherwise, change the domain name to your PowerSchool image server's domain name).
