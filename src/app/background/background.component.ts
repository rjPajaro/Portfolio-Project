import { Component } from '@angular/core';
import { EducationEntry, WorkExperience } from '../_shared/models/background.model';

@Component({
  selector: 'app-background-component',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent {

  education: EducationEntry[] = [
    {
      title: 'Bachelor of Science in Computer Science',
      institution: 'Mapua University',
      start: '2018',
      end: '2024',
      description: ''
    },
    {
      title: 'Senior High School',
      institution: 'College of San Benildo Rizal',
      start: '2016',
      end: '2018',
      description: ''
    }
  ];

  workExperience: WorkExperience[] = [
    {
      company: 'You_Source',
      role: 'Associate Software Engineer',
      start: 'February 2022',
      end: 'Present',
      description: 'Working as a full-stack developer using Angular and .NET technologies to build maintainable and scalable web applications.'
    },
    {
      company: 'You_Source',
      role: 'Software Engineer Intern',
      start: 'October 2021',
      end: 'January 2022',
      description: 'Assisted in developing web applications and gained practical experience in software development lifecycle and teamwork.'
    }
  ];

}
