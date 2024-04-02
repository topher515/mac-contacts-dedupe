

import { findDuplicateContacts } from './index'; 
import { calculateMergedContact } from './index'; 

describe('findDuplicateContacts', () => {
  it('should return duplicate contacts', async () => {
    const contacts = [
      { firstName: 'John', lastName: 'Doe', emailAddresses: ['john@example.com'] },
      { firstName: 'Tyler', lastName: 'Doe', emailAddresses: ['jane@example.com'] },
      { firstName: 'John', lastName: 'Doe', emailAddresses: ['john2@example.com'] },
      { firstName: 'Jon', lastName: 'Doe', emailAddresses: ['jon@example.com'] },
    ];

    const expected = [
      [
        { firstName: 'Jon', lastName: 'Doe', emailAddresses: ['jon@example.com'] },
        { firstName: 'John', lastName: 'Doe', emailAddresses: ['john2@example.com'] },
        { firstName: 'John', lastName: 'Doe', emailAddresses: ['john@example.com'] },
      ],
    ];

    const result = await findDuplicateContacts(contacts);
    expect(result).toEqual(expected);
  });
    
  it('should handle empty and one', async () => {
    const contacts = [];
    const expected = [];
    const result = await findDuplicateContacts(contacts);
    expect(result).toEqual(expected);
  })

  it('should handle one contact', async () => {
    const contacts = [
      { firstName: 'John', lastName: 'Doe', emailAddresses: ['john@example.com'] },
    ];
    const expected = [];
    const result = await findDuplicateContacts(contacts);
    expect(result).toEqual(expected);
  })

  it('should handle multiple sets of matched contact', async () => {
    const contacts = [
      { firstName: 'John', lastName: 'Doe', emailAddresses: ['john@example.com'] },
      { firstName: 'Tyler', lastName: 'Perry', emailAddresses: ['tyler@example.com'] },
      { firstName: 'John', lastName: 'Doe', emailAddresses: ['john2@example.com'] },
      { firstName: 'Jon', lastName: 'Doe', emailAddresses: ['jon@example.com'] },
      { firstName: 'Tyle', lastName: 'Perry', emailAddresses: ['tyler@example.com'] },
      { firstName: 'Anna', lastName: 'Testing', emailAddresses: ['tyler@example.com'] },
    ];

    const expected = [
      [
        { firstName: 'John', lastName: 'Doe', emailAddresses: ['john@example.com'] },
        { firstName: 'John', lastName: 'Doe', emailAddresses: ['john2@example.com'] },
        { firstName: 'Jon', lastName: 'Doe', emailAddresses: ['jon@example.com'] },
      ],
      [
        { firstName: 'Tyle', lastName: 'Perry', emailAddresses: ['tyler@example.com'] },
        { firstName: 'Tyler', lastName: 'Perry', emailAddresses: ['tyler@example.com'] },
      ]
    ];

    const result = await findDuplicateContacts(contacts);
    expect(result).toEqual(expected);
  })

});

describe('calculateMergedContact', () => {
  it('should merge simple contact', async () => {

    const contacts = [
      { firstName: 'John', lastName: 'Doe', emailAddresses: ['foo@bar.com'] },
      { firstName: 'John', lastName: 'Doe', emailAddresses: ['baz@bar.com'] },
    ]

    const expected = {
      firstName: 'John',
      lastName: 'Doe',
      emailAddresses: ['foo@bar.com', 'baz@bar.com']
    }

    const result = calculateMergedContact(contacts)
    expect(result).toEqual(expected);

  })

})