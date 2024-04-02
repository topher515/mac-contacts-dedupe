import { getAllContacts } from 'node-mac-contacts';
import { distance as levDistance } from 'fastest-levenshtein';
import * as R from 'remeda';

const getContacts = (): Promise<Contact[]> => {
  return new Promise((resolve, reject) => {
    getAllContacts((err, contacts) => {
      if (err) {
        reject('Failed to get contacts: ' + err);
      } else {
        resolve(contacts);
      }
    });
  });
};


interface Contact {
  firstName?: string
  middleName?: string
  lastName?: string
  nickname?: string
  jobTitle?: string
  departmentName?: string
  organizationName?: string
  birthday?: string
  note?: string
  contactImage?: string
  contactThumbnailImage?: string

  instantMessageAddresses?: string[]
  socialProfiles?: string[]
  urlAddresses?: string[]
  phoneNumbers?: string[]
  emailAddresses?: string[]
}

const ARRAY_FIELDS: readonly string[] = ['instantMessageAddresses', 'socialProfiles', 'urlAddresses', 'phoneNumbers', 'emailAddresses'];


export function isDupe(contact: Contact, compareContact: Contact) {
  const threshold = 4; // Levenshtein distance threshold
  if (contact.lastName && compareContact.lastName && contact.lastName === compareContact.lastName) {
    if (contact.firstName && compareContact.firstName) {
      const distance = levDistance(contact.firstName, compareContact.firstName);
      if (distance <= threshold) {
        return true
      }
    }
  }
  return false
}

function sortContacts(contacts: Contact[]): Contact[]{
  return R.pipe(
    contacts,
    R.sortBy(
      [async contact => contact.firstName, "asc"],
      [async contact => contact.lastName, "asc"],
    ),
  )
}



export const findDuplicateContacts = async (contacts: Array<Contact>) => {
  const duplicates: Contact[][] = [];

  let contactsInConsideration = contacts.filter(contact => contact.firstName && contact.lastName);

  while (true) {

    const contact = contactsInConsideration.pop();
    if (!contact) {
      break; // No more contacts to consider
    }
    let nonDupes: Contact[] = [];
    let dupes: Contact[] = [];

    while (true) {

      const compareContact = contactsInConsideration.pop()
      if (!compareContact) {
        break;
      }
      if (isDupe(contact, compareContact)) {
        dupes.push(compareContact)
      } else {
        nonDupes.push(compareContact)
      }
    }

    if (dupes.length) {
      dupes.unshift(contact)
      duplicates.push(sortContacts(dupes))
    }
    contactsInConsideration = nonDupes
  }

  return duplicates;
  
};


// Assume these are placeholder functions for actual contact management logic
const deleteContact = (contact: Contact) => {
  console.log(`Placeholder for deleting contact: ${contact.firstName} ${contact.lastName}`);
};

const updateContact = (contact: Contact) => {
  console.log(`Placeholder for updating contact: ${contact.firstName} ${contact.lastName} with emails: ${contact.emailAddresses} and phones: ${contact.phoneNumbers}`);
};

export const calculateMergedContact = (contacts: Contact[]) => {
  if (contacts.length < 2) {
    throw Error('At least two contacts are required to merge');
  }

  console.log("The following contacts have been identified as duplicates and will be merged:");
  contacts.forEach((contact, index) => {
    console.log(`${index + 1}: ${contact.firstName} ${contact.lastName}`);
  });

  // Initialize the consolidated contact with the first contact's basic info
  let consolidatedContact: Contact = {
    firstName: R.pipe(contacts, R.map(c => c.firstName), R.filter(R.isNonNullish), R.first()),
    lastName: R.pipe(contacts, R.map(c => c.lastName), R.filter(R.isNonNullish), R.first()),
    middleName: R.pipe(contacts, R.map(c => c.middleName), R.filter(R.isNonNullish), R.first()),
    nickname: R.pipe(contacts, R.map(c => c.nickname), R.filter(R.isNonNullish), R.first()),
    jobTitle: R.pipe(contacts, R.map(c => c.jobTitle), R.filter(R.isNonNullish), R.first()),
    departmentName: R.pipe(contacts, R.map(c => c.departmentName), R.filter(R.isNonNullish), R.first()),
    organizationName: R.pipe(contacts, R.map(c => c.organizationName), R.filter(R.isNonNullish), R.first()),
    birthday: R.pipe(contacts, R.map(c => c.birthday), R.filter(R.isNonNullish), R.first()),
    note: R.pipe(contacts, R.map(c => c.note), R.filter(R.isNonNullish), R.first()),
    contactImage: R.pipe(contacts, R.map(c => c.contactImage), R.filter(R.isNonNullish), R.first()),
    contactThumbnailImage: R.pipe(contacts, R.map(c => c.contactThumbnailImage), R.filter(R.isNonNullish), R.first()),
    instantMessageAddresses: R.flatMap(contacts, contact => contact.instantMessageAddresses).filter((val): val is string => R.isString(val)),
    socialProfiles: R.flatMap(contacts, contact => contact.socialProfiles).filter((val): val is string => R.isString(val)),
    emailAddresses: R.flatMap(contacts, contact => contact.emailAddresses).filter((val): val is string => R.isString(val)),
    phoneNumbers: R.flatMap(contacts, contact => contact.phoneNumbers).filter((val): val is string => R.isString(val)),
    urlAddresses: R.flatMap(contacts, contact => contact.urlAddresses).filter((val): val is string => R.isString(val)),
  };

  return R.pickBy(consolidatedContact, value => value !== undefined && Array.isArray(value) ? value.length > 0 : value !== undefined);
}


// const mergeContacts = async (contacts: Contact[][]) => {
//   console.log("After merging, the consolidated contact will contain:");
//   console.log(`Name: ${consolidatedContact.firstName} ${consolidatedContact.lastName}`);
//   fieldsToMerge.forEach(field => {
//     if (consolidatedContact[field]?.length) {
//       console.log(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${consolidatedContact[field].join(', ')}`);
//     }
//   });

//   const isConfirmed = readlineSync.question('Do you want to proceed with the merge? (yes/no): ');

//   if (isConfirmed.toLowerCase() === 'yes') {
//     updateContact(consolidatedContact); // Assuming the first contact is kept and updated
//     contacts.slice(1).forEach(deleteContact); // Delete the other contacts
//     console.log("Contacts have been merged successfully.");
//   } else {
//     console.log("Operation cancelled.");
//   }
// };

async function main() {
  const contacts = await getContacts();
  const duplicates = await findDuplicateContacts(await getContacts())

}