# QMEssentials
QMEssentials is a simple quality management application for small to medium-sized businesses who make things.

QMEssentials comes in three "sizes":

#### QMEssentials Lite 
* Built on Microsoft Access
* Suitable for small teams with limited reporting needs
* Single numeric result per metric
* Built-in reports: observations by lot or product, observations out of range
* Very limited user authentication, role-based authorization
* Requires only Microsoft Windows and Microsoft Access and a shared location to store the file; no application server or database server needed

#### QMEssentials Standard
* Built on PHP and MySQL
* Suitable for one or possibly two plants, 50 or more quality operators, hundreds of transactions per minute
* Single or multiple numeric results per metric
* Built-in reports: observations by lot or product, observations out of range
* Password-based user authentication, role-based authorization
* Requires PHP and MySQL on server (can be same server, one or both can be cloud-based) and a modern web browser

#### QMEssentials Enterprise
* NoSQL database (probably DynamoDB or MongoDB) with reporting engine in ASP.NET Core, API in Express/Node, and user interface in React
* Can be scaled to large operations with hundreds of operators and thousands of transactions per minute
  * API can be scaled horizontally
  * Database can scale horizontally or vertically
  * Reporting engine scales vertically, but with very high capacity
  * UI logic can be delivered via CDN and runs locally in web browser
  * Also supports automatic feeds of observation data from external providers and devices
* Single or multiple results per metric
  * Results can be numeric, text, yes/no, date/time, or timespan
  * Min and max ranges for numeric, text, date/time, and timespan metrics
  * Patterns and lists for text metrics
* Automatic nofications in addition to built-in reports
  * Reports include observations by lot or product, observations out of range
  * Automatic notifications based on subscription to specific criteria
  * Observation-based notification criteria: value outside specified range, value outside specified standard deviation
  * Lot-based notification criteria: mean outside specified range, median outside specified range, standard deviation outside specified range
* Password-based user authentication, role-based authorization
* Requires database server (possibly), one or more API servers, a reporting server, and one or more front-end delivery servers (all can be the same physical hardware, depending on scale needed) as well as a modern web browser

QMEssentials is free, open-source software distributed under a permissive MIT license. Any individual or organization can download and use the software for any purpose, commercial or otherwise.

**QMEssentials is in the early stages of development. Contributions are welcome. Check out the [Trello board]( https://trello.com/b/xAjdb5mN)!**
