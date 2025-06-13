// Necessary Imports (you will need to use this)
const { Student } = require('./Student')
const fs = require('fs/promises')


/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data;               // Student
  next;               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }

}


/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;

  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  
  addStudent(newStudent) {
    // TODO
    const newNode = new Node (newStudent)
    if (this.head===null){
      this.head = this.tail = newNode;
    }else{
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length ++
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
    removeStudent(email) {
    if (!this.head) return;

    if (this.head.data.getEmail() === email) {
      this.head = this.head.next;
      this.length--;
      return;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.data.getEmail() === email) {
        current.next = current.next.next;
        this.length--;
        return;
      }
      current = current.next;
    }
  }

    /**
     * REQUIRES:  email (String)
     * EFFECTS:   None
     * RETURNS:   The Student or -1 if not found
     */
  
    findStudent(email) {
    let current = this.head;
    while (current) {
      if (current.data.getEmail() === email) {
        return current.data;
      }
      current = current.next;
    }
    return -1; 
  }



  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  #clearStudents() {
  this.head = null;
  this.tail = null;
  this.length = 0;
  }
    clear() {
    this.#clearStudents();
  }



  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    let result = [];
    let current = this.head;
    while (current) {
      result.push(current.data.getName()); 
      current = current.next;
    }
    const output = result.join(', ');
    console.log(output);
    return output;
  }
  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  sortStudentsByName(students) {
    return students.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
    filterBySpecialization(spec) {
    let current = this.head;
    const result = [];
    while (current) {
      if (current.data.getSpecialization() === spec) {
        result.push(current.data);
      }
      current = current.next;
    }
    return result;
  }

  

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    // TODO
    const matched = [];
    let current = this.head;

    while (current) {
      if (current.data.age >= minAge) {
        matched.push(current.data);
      }
      current = current.next;
    }
    return this.sortStudentsByName(matched);
  }


  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    const students = [];
    let current = this.head;
    while (current) {
      students.push({
        name: current.data.getName(),
        year: current.data.getYear(),
        email: current.data.getEmail(),
        specialization: current.data.getSpecialization()
      });
      current = current.next;
    }

    await fs.writeFile(fileName, JSON.stringify(students, null, 2));
    console.log(`Saved ${students.length} students to ${fileName}`);
  }


  /**
    * REQUIRES:  A valid file name (String) that exists
    * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
    * RETURNS:   None
    * CONSIDERATIONS:
    *  - Use clearStudents() to perform overwriting
    */
  async loadFromJSON(fileName) {
    try {
      const data = await fs.readFile(fileName, 'utf8');
      const students = JSON.parse(data);

      this.head = null;
      this.length = 0;

      for (const s of students) {
        const student = new Student(s.name, s.year, s.email, s.specialization);
        this.addStudent(student);
      }

      console.log(`Loaded ${students.length} students from ${fileName}`);
    } catch (err) {
      console.error("Failed to load JSON:", err.message);
    }
  }




}



module.exports = { LinkedList }
