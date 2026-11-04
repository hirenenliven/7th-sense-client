import { MANAGERS, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

// Content of the User Guide (UserGuide.jsx renders it). Written for the people who use the app: what
// to do first, where, and what each message means. Keep it in step with the screens and the server
// rules (docs/pages); error texts are quoted exactly so the guide's search finds them.

// Who does a step / may use a screen, as shown on the guide's badges (`tone`: badge-soft-<tone>)
export const WHO = {
  team: { label: 'Account team', tone: 'violet', roles: SUPERADMIN_ONLY, help: 'Done by the 7th Sense Super Administrator for your company.' },
  managers: { label: 'Customer · Admin', tone: 'primary', roles: MANAGERS, help: 'The customer login and its administrators.' },
  everyone: { label: 'Every user', tone: 'success', roles: [], help: 'Every logged-in user, for the data of their own company.' },
}

// The first-time setup, in the order the screens depend on each other. `who` → WHO key; `path` is
// the screen the "Open" button goes to.
export const SETUP_STEPS = [
  {
    key: 'account',
    title: 'Your company account is created',
    who: 'team',
    path: ROUTES.CUSTOMER_ADD,
    summary: 'The company, its main login, address, time zone and production-day start.',
    steps: [
      'Account Center › Customer › Add New. A customer needs a Branch: if the list is empty, add a branch first (Organization › Branch).',
      'Company details, then the login (email, user name, password). The password is set only here, when adding.',
      'Address: pick the country first. For India, GST No. (15 characters) and PAN No. (10 characters) are required and Zip Code is a 6-digit PIN.',
      'Settings: Time Zone and Day Start From of the plant, the colour theme, and the filters the customer may use on reports.',
    ],
    tips: [
      'Time Zone and Day Start From decide when a production day starts and ends, so "today" and daily figures follow the plant clock. Set them before data comes in.',
    ],
  },
  {
    key: 'regions',
    title: 'Countries and states are added for you',
    who: 'team',
    path: ROUTES.ORG_COUNTRIES,
    summary: 'The countries and states your company works in. You add your own cities under them.',
    steps: [
      'Organization › Country › Add Countries: pick the customer, tick its countries, save.',
      'Organization › State › Add States: pick the customer and its countries, tick their states, save.',
    ],
    tips: ['Customers and their users only read countries and states. To add or correct one, ask your account team.'],
  },
  {
    key: 'licence',
    title: 'Licence keys are issued',
    who: 'team',
    path: ROUTES.LICENCE_KEYS,
    summary: 'Keys and their subscription period, managed by the account team under Account Center › Licence Key.',
    steps: [
      'Account Center › Licence Key › Generate Licence Key: pick the customer and the number of keys (1 to 100), then Generate Key.',
      'Choose a Subscription Duration per key (or "Set all"), then Save. Generated keys are kept only after Save.',
    ],
    tips: ['Expires On shows when a key ends; Life Time keys never expire. Expired keys are marked so you can renew them in time.'],
  },
  {
    key: 'catalog',
    title: 'Machine catalog is ready',
    who: 'team',
    path: ROUTES.CONTROLLERS,
    summary: 'Brands, their controllers and the machine models, so your machines can be picked from lists.',
    steps: [
      'Account Center › Machine Catalog › Controllers: add the controllers of each brand.',
      'Machine Catalog › Models: add the machine models of each controller.',
    ],
    tips: ['If your machine model is missing from Add Machine, ask your account team to add it to the catalog.'],
  },
  {
    key: 'first-login',
    title: 'Log in and find your way',
    who: 'everyone',
    path: ROUTES.HOME,
    summary: 'Sign in, open the menu and set how the app looks for you.',
    steps: [
      'Sign in with your user name and password. Tick Remember me on your own computer to stay signed in after closing the browser.',
      'Menu (top left) opens the sidebar. Items with an arrow open their screens.',
      'The sun / moon button switches between dark and light theme; your choice is saved to your login.',
      'The user menu (top right) has this guide and Sign out.',
    ],
    tips: ['Screens your role may not use are hidden from the menu, and buttons you may not use (Add, Edit, Delete) are not shown.'],
  },
  {
    key: 'organization',
    title: 'Build your organization',
    who: 'managers',
    path: ROUTES.ORG_CITIES,
    summary: 'Masters › Organization, top to bottom: City → Location → Shop → Line → Cell → Supervisor.',
    steps: [
      'City: add your cities under the states added for you.',
      'Branch: branches are added by your account team. Ask them for a new one.',
      'Location (under a branch) → Shop → Line → Cell → Supervisor: each is added under one from the level above.',
    ],
    tips: [
      'Add lines before machines: a machine is placed on a line.',
      'Names must be unique under the same parent. Something with items under it cannot be deleted until those are deleted.',
    ],
  },
  {
    key: 'shifts',
    title: 'Set shifts, breaks and holidays',
    who: 'managers',
    path: ROUTES.SHIFTS,
    summary: 'Working hours decide availability and OEE, and schedules are planned inside shifts.',
    steps: [
      'Shift › Add / Manage Shift: name, start and end time. An end time not after the start (e.g. 22:00 → 06:00) runs past midnight.',
      'Shift › Breaks: add each break and put it on a shift (or pick breaks in the shift form under Shift Break Type).',
      'Shift › Holiday / Week Off: add holidays by date and the weekly off days.',
    ],
    tips: ['A break must sit inside its shift and must not overlap another break of that shift. Each break belongs to one shift at most.'],
  },
  {
    key: 'reasons',
    title: 'Add downtime and idle reasons',
    who: 'managers',
    path: ROUTES.DOWNTIME_REASONS,
    summary: 'The reasons operators pick when a machine is down or stands idle.',
    steps: [
      'Downtime › Downtime List: add each reason (Reason up to 50 characters, optional Reason Code up to 10).',
      'Downtime › Idle List: the same for idle reasons.',
    ],
    tips: ['Keep reasons short and distinct (e.g. "Tool change", "No material") so reports group them well.'],
  },
  {
    key: 'machines',
    title: 'Add your machines',
    who: 'managers',
    path: ROUTES.MACHINE_ADD,
    summary: 'Operations › All Machines › Add Machine: catalog, line, dates and the controller connection.',
    steps: [
      'Pick Brand → Controller → Model Name (each list follows the one before).',
      'Pick the Machine Line No. and enter serial no., installation date and costs.',
      'Connection: Live IP, Local IP, Port, user name / password and Security Type of the controller (OPC UA). Ask your IT team for these.',
      'Tick the Machine Health sensors to watch, then save.',
    ],
    tips: [
      'Once the data collector reaches the machine it shows Online, and its mode appears on Monitoring › Machines.',
      'The controller password is never shown again after saving; leave it blank on Edit to keep it.',
    ],
  },
  {
    key: 'users',
    title: 'Add your team',
    who: 'managers',
    path: ROUTES.USER_ADD,
    summary: 'Masters › Users › Add User: admins, supervisors, operators, quality control and shop heads.',
    steps: [
      'Fill in the person, their login and their Branch.',
      'Access: pick the Role (only the roles you may give are listed).',
      'Machines: tick the machines the person works on. Admins see every machine of the company, so they have no Machines list.',
    ],
    tips: ['Supervisors and operators added here are the ones offered on the production schedule.'],
  },
  {
    key: 'clientele',
    title: 'Add your clientele',
    who: 'managers',
    path: ROUTES.CLIENTELES,
    summary: 'Masters › Clientele: the clients you make parts for.',
    steps: ['Add each client with its client ID, address and contact. The contact number is typed without the country code.'],
    tips: ['A clientele that parts use cannot be deleted or moved to another customer.'],
  },
  {
    key: 'parts',
    title: 'Add parts and their processes',
    who: 'managers',
    path: ROUTES.PART_ADD,
    summary: 'Masters › Parts › Add Part: what you make, for which client, and how.',
    steps: [
      'Pick the Clientele, enter Part No., Part Name and Part Count (parts per cycle).',
      'Add each process: process and program name, Applicable Machines, drawing no. / revision and the drawing (PDF, up to 10 MB).',
      'Enter setup, cycle and loading times; turn on Sub Program to add sub programs with their cycle times. Production time is worked out for you.',
    ],
    tips: ['Only the machines ticked on a process can run it on a schedule.'],
  },
  {
    key: 'schedule',
    title: 'Plan production',
    who: 'managers',
    path: ROUTES.PRODUCTION_SCHEDULE_ADD,
    summary: 'Production › Schedule › Add Schedule: which jobs a machine runs, when and by whom.',
    steps: [
      'Pick the machine and the Schedule Type: Single Day (one date) or Multiple Day (a date range; each job picks its day).',
      'Add jobs: Job ID, supervisor, operator, shift, part, quantity, part process, start and end time.',
    ],
    tips: [
      'Job times must be inside the shift and must not overlap other jobs. A machine can be scheduled only once per day.',
      'Changing the machine clears the processes picked; for the account team, changing the customer clears every job.',
    ],
  },
  {
    key: 'monitor',
    title: 'Watch your machines live',
    who: 'everyone',
    path: ROUTES.MONITORING,
    summary: 'Operations › Monitoring › Machines: every machine with its current mode; open Productivity or Health.',
    steps: [
      'The list shows each machine’s mode (In Production, Idle, Downtime, Offline …) and refreshes every 30 seconds. A red dot means offline.',
      'Productivity: today’s cycles, OEE and time per mode, the mode timeline (last minutes or a whole day) and the OEE trend.',
      'Machine Health: Machine Time by Day is live; the sensor charts are previews until sensor data is connected.',
    ],
    tips: ['Use the machine list at the top of Productivity / Health to switch machines without going back.'],
  },
]

// What each role may do (rows of the guide's roles table)
export const ROLE_ACCESS = [
  { role: ROLES.SUPERADMIN, can: 'Everything, for every customer: customers, countries / states, branches, licence keys, machine catalog, and deleting machines.' },
  { role: ROLES.CUSTOMER, can: 'Their whole company: organization (from City down), shifts, reasons, machines, users, clientele, parts and schedules. Reads licence keys.' },
  { role: ROLES.ADMIN, can: 'The same as the customer login, for the same company. Sees every company machine.' },
  { role: ROLES.SUPERVISOR, can: 'Reads the company’s setup and schedules, and monitors the machines assigned to them.' },
  { role: ROLES.OPERATOR, can: 'Reads schedules and monitors the machines assigned to them.' },
  { role: ROLES.QC, can: 'Reads the company’s setup and monitors the machines assigned to them.' },
  { role: ROLES.SHOP_HEAD, can: 'Reads the company’s setup and monitors the machines assigned to them.' },
]

// Screen reference, by sidebar area. `who` = who may add / change (everyone else reads).
export const SCREENS = [
  {
    area: 'Operations',
    items: [
      { key: 'all-machines', title: 'All Machines', path: ROUTES.MACHINES, who: 'managers', text: 'Machine set-up as a table or cards: add and edit (customer, admin), delete (account team). Live data is under Monitoring.' },
      { key: 'monitoring', title: 'Monitoring', path: ROUTES.MONITORING, who: 'everyone', text: 'Machines tab with the current mode of each machine, then Productivity and Machine Health of one machine.' },
      { key: 'schedule', title: 'Production › Schedule', path: ROUTES.PRODUCTION_SCHEDULE, who: 'managers', text: 'Production plans per machine and day; open one to edit its jobs.' },
    ],
  },
  {
    area: 'Masters',
    items: [
      { key: 'organization', title: 'Organization', path: ROUTES.ORG_COUNTRIES, who: 'managers', text: 'A tab per level: Country, State (account team), City, Branch (account team), Location, Shop, Line, Cell, Supervisor.' },
      { key: 'clientele', title: 'Clientele', path: ROUTES.CLIENTELES, who: 'managers', text: 'The clients you make parts for, with their address and contact.' },
      { key: 'parts', title: 'Parts', path: ROUTES.PARTS, who: 'managers', text: 'Parts with their clientele, processes, applicable machines and drawings.' },
      { key: 'shift', title: 'Shift', path: ROUTES.SHIFTS, who: 'managers', text: 'Shifts (cards with their breaks), Breaks, and Holiday / Week Off.' },
      { key: 'downtime', title: 'Downtime', path: ROUTES.DOWNTIME_REASONS, who: 'managers', text: 'Downtime List and Idle List: the reasons picked when a machine is down or idle.' },
      { key: 'users', title: 'Users', path: ROUTES.USERS, who: 'managers', text: 'Your company’s users: the users created for your company, their role, branch and machines (the account team sees every company’s). Open one to see all details.' },
    ],
  },
  {
    area: 'System',
    items: [
      { key: 'account-center', title: 'Account Center', path: ROUTES.ACCOUNT_CENTER, who: 'team', text: 'Customer list (the main customer accounts), Licence Key and Machine Catalog.' },
      { key: 'user-guide', title: 'User Guide', path: ROUTES.USER_GUIDE, who: 'everyone', text: 'This page.' },
    ],
  },
]

// How every list screen works (shown once instead of on each screen)
export const LIST_BASICS = [
  { icon: 'bi-search', title: 'Search and filter', text: 'Type in the search box; the superadmin also gets a customer filter. Click a column title to sort it.' },
  { icon: 'bi-list-ol', title: 'Rows per page', text: 'Choose 10–100 rows under the list and move between pages; new entries appear at the top.' },
  { icon: 'bi-pencil', title: 'Edit and delete', text: 'The pencil edits, the bin deletes after you confirm. Only roles allowed to change a screen see them.' },
  { icon: 'bi-toggle-on', title: 'Status', text: 'Active / Inactive is shown as a badge; change it on Edit (or with the switch where a list has one).' },
]

// Troubleshooting, by topic. Error texts are quoted as the app shows them.
export const TROUBLESHOOTING = [
  {
    topic: 'Signing in and access',
    icon: 'bi-shield-lock',
    items: [
      { q: '"Invalid username or password"', a: 'Check the user name and password (the password is case-sensitive). If you forgot it, ask your administrator; passwords are set when the login is created.' },
      { q: 'Too many attempts / "try again in 15 minutes"', a: 'After several wrong passwords sign-in is locked for 15 minutes. Wait, then try again with the right password.' },
      { q: 'My account is inactive', a: 'An inactive login cannot sign in. Ask your administrator to set it Active on Masters › Users.' },
      { q: 'I was sent back to the sign-in page', a: 'Your session ended (it times out, and without Remember me it ends when the browser closes). Sign in again; you return to the screen you asked for.' },
      { q: 'A screen says I may not open it, or a menu item is missing', a: 'Your role does not include that screen. See "Who can do what"; ask your administrator if you need more access.' },
      { q: 'A screen says it is planned and will be available soon', a: 'That screen is not released yet. "All screens" below shows what is available today.' },
    ],
  },
  {
    topic: 'Forms and saving',
    icon: 'bi-input-cursor-text',
    items: [
      { q: 'I pressed Save and nothing was saved', a: 'Fields that need attention are outlined in red with a message, and the form jumps to the first one. Fix them and save again. A message from the server appears as a notification at the corner.' },
      { q: 'What do * and the (i) icon mean?', a: '* marks a required field. (i) opens a short explanation with an example and the rules of that field.' },
      { q: '"… already exists"', a: 'Names, codes, user names and emails must be unique (within the same parent or customer). Use another name, or edit the one that exists.' },
      { q: 'A dropdown is empty or shows "unavailable"', a: 'Most lists follow another choice (pick the customer, brand or controller first) or need data from another screen. "Unavailable" means the list could not load: reload the page.' },
      { q: 'State went blank after I changed the country', a: 'Each country has its own states, so State is cleared when Country changes. Pick it again.' },
      { q: 'Reset or Cancel?', a: 'Reset puts the form back to how it was when you opened it. Cancel leaves without saving.' },
    ],
  },
  {
    topic: 'Organization',
    icon: 'bi-diagram-3',
    items: [
      { q: 'I cannot add a country or state', a: 'Countries and states are added for your company by the account team. Ask them for the one you need.' },
      { q: 'I cannot add or edit a branch', a: 'Branches are managed by the account team. Ask them to add or change it.' },
      { q: '"This … has … Delete its … first"', a: 'An item with items under it cannot be deleted (e.g. "This shop has lines. Delete its lines first"). Delete from the bottom up: supervisors, cells, lines, shops, locations, branches, cities.' },
      { q: 'The parent list is empty when adding a level', a: 'Each level needs its parent: add the city before the location, the location before the shop, and so on.' },
      { q: 'Country or State cannot be edited', a: 'They are fixed once added. To correct one, ask the account team to delete it and add it again.' },
    ],
  },
  {
    topic: 'Machines and monitoring',
    icon: 'bi-cpu',
    items: [
      { q: 'My machine shows Offline (red dot)', a: 'The data collector cannot reach it. Check the machine is on and networked, and that Live IP, Port, user name, password and Security Type on Edit Machine match the controller.' },
      { q: 'No mode is shown for a machine', a: 'The collector has not reported a mode yet. It appears once the machine is online; the list refreshes every 30 seconds.' },
      { q: 'My model / controller is not in the list', a: 'The machine catalog is kept by the account team. Ask them to add it.' },
      { q: 'Machine Line No. is empty', a: 'Add the line first under Organization › Line (its shop, location and branch must exist).' },
      { q: 'I do not see a machine', a: 'You see only the machines assigned to your login (admins see all). Ask your administrator to tick it under Machines on your user.' },
      { q: 'Productivity shows zeros or "Machine not found"', a: 'Zeros mean no data for the chosen day / shift yet. "Machine not found" means the machine is not one of yours.' },
      { q: '"Machines use this controller / model …"', a: 'A controller or model in use cannot be deleted or moved. Change or delete those machines first.' },
    ],
  },
  {
    topic: 'Shifts, parts and schedules',
    icon: 'bi-calendar3',
    items: [
      { q: 'A night shift is rejected', a: 'Enter it as it runs, e.g. 22:00 to 06:00: an end time not after the start runs past midnight. Start and end cannot be the same time.' },
      { q: 'A break is not offered on my shift', a: 'Each break belongs to one shift at most; breaks taken by another shift are not offered. It must also sit inside the shift and not overlap its other breaks.' },
      { q: '"Part drawing must be a PDF file" / "… 10 MB or smaller"', a: 'Upload the drawing as a PDF of 10 MB or less.' },
      { q: 'No part process is offered on the schedule', a: 'Only processes that list this machine under Applicable Machines are offered. Edit the part and tick the machine.' },
      { q: '"This machine is already scheduled on the selected date(s)"', a: 'A machine has one schedule per day. Edit the existing schedule instead, or pick another date.' },
      { q: 'A job time is refused', a: 'Jobs must be inside their shift and must not overlap other jobs on the schedule.' },
      { q: '"This clientele is used by parts …"', a: 'Clientele used by parts cannot be deleted or moved to another customer. Change those parts first.' },
    ],
  },
]

// What to send support when the guide does not solve it
export const SUPPORT_CHECKLIST = [
  'The screen you were on (the page title) and what you clicked.',
  'The exact message shown, word for word, or a screenshot.',
  'The machine, part or schedule involved (its name or ID).',
  'The date and time it happened, and your user name.',
]
