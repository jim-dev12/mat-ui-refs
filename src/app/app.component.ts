import { Component, computed, signal } from '@angular/core';

export interface Task {
  id: number;
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'mat-ui-no-standalone';

  readonly tasks = signal<Task[]>([
    {
      id: 1,
      name: 'Parent task',
      completed: false,
      subtasks: [
        { id: 12,name: 'Child task 1', completed: false },
        { id: 13,name: 'Child task 2', completed: false },
        { id: 14,name: 'Child task 3', completed: false },
      ]
    },
    {
      id: 2,
      name: 'Parent taskb',
      completed: false,
      subtasks: [
        { id: 15,name: 'Child task 1', completed: false },
        { id: 16, name: 'Child task 2', completed: false },
        { id: 17,name: 'Child task 3', completed: false },
      ]
    },
    {
      id: 3,
      name: 'Parent taskc',
      completed: false,
      subtasks: [
        {id: 18,name: 'Child task 1', completed: false},
        {id: 19,name: 'Child task 2', completed: false},
        {id: 21,name: 'Child task 3', completed: false},
      ]
    },
  ]);

  readonly partiallyComplete = (task: Task) => computed(() => {
    if (!task.subtasks) {
      return false;
    }
    return task.subtasks.some(t => t.completed) && !task.subtasks.every(t => t.completed);
  });

  update(completed: boolean, task1: Task, isParent: boolean) {

    this.tasks.update(task => {
      if (isParent) {
        let parentTask = task.filter(t => t.id === task1.id)
        if (parentTask[0]) {
          parentTask[0].completed = completed
          parentTask[0].subtasks?.forEach(t => (t.completed = completed))
        }
      }
      else {
        let parentTask = task.filter(t => t.subtasks?.some(x => x.id === task1.id))

        let childTask = task.flatMap(t => t.subtasks?.filter(x => x.id === task1.id))
        if (childTask[0]) {
          childTask[0].completed = completed
        }
        parentTask[0].completed = parentTask[0].subtasks?.every(t => t.completed) ?? true;

      }
      return task
    })
  }

  save() {
    let parentTask = this.tasks().filter(t => t.subtasks?.some(x => x.completed)).map(x => x.id)
    let checkedTasks = this.tasks().flatMap(t => {
      return t.subtasks?.filter(x => x.completed)
    }).map(x => x?.id)
     
    console.log('parent ids: ', parentTask, 'children ids: ', checkedTasks)
  }
}
