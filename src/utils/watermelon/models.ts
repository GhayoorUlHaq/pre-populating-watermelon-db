import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Student extends Model {
  static table = 'students';

  @field('name') name;
  @field('class') class;
  @field('age') age;
}

export {Student};
