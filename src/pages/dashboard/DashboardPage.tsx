import { Box, Grid, Heading, Stat, Card, Spinner, Center, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { studentService } from '../../service/studentService';
import { teacherService } from '../../service/teacherService';
import { subjectService } from '../../service/subjectService';
import type { ChartData } from 'chart.js';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    subjects: 0
  });

  const [studentAdmissions, setStudentAdmissions] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: []
  });

  const [genderDistribution, setGenderDistribution] = useState<ChartData<'pie'>>({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentRes, teacherRes, subjectRes] = await Promise.all([
          studentService.getAllStudents(1, 1),
          teacherService.getAllTeachers(1, 1),
          subjectService.getAllSubjects(1, 1)
        ]);

        const studentCount = studentRes.data?.totalCount || 0;
        const teacherCount = teacherRes.data?.totalCount || 0;
        const subjectCount = subjectRes.data?.totalCount || 0;

        setCounts({
          students: studentCount,
          teachers: teacherCount,
          subjects: subjectCount
        });

        const allStudentsRes = await studentService.getAllStudents(1, 100);
        const students = allStudentsRes.data?.results || [];

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyCounts = new Array(12).fill(0);
        let hasValidDates = false;
        
        students.forEach(student => {
          const dateStr = student.createdAt || student.updatedAt;
          if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              const monthIndex = date.getMonth();
              monthlyCounts[monthIndex]++;
              hasValidDates = true;
            }
          }
        });

        if (hasValidDates) {
          setStudentAdmissions({
            labels: months,
            datasets: [
              {
                label: 'New Admissions',
                data: monthlyCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
              }
            ]
          });
        }

        // Gender for Distribution Chart
        const genderCounts: Record<string, number> = {};
        students.forEach(student => {
          const gender = student.gender || 'Unknown';
          genderCounts[gender] = (genderCounts[gender] || 0) + 1;
        });

        if (Object.keys(genderCounts).length > 0) {
          setGenderDistribution({
            labels: Object.keys(genderCounts),
            datasets: [
              {
                label: 'Student Distribution',
                data: Object.values(genderCounts),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(54, 162, 235, 0.5)',
                  'rgba(255, 206, 86, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
              }
            ]
          });
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Heading mb={6}>School Overview Dashboard</Heading>
      
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>
        <Card.Root>
          <Card.Body>
            <Stat.Root>
              <Stat.Label>Total Students</Stat.Label>
              <Stat.ValueText>{counts.students.toLocaleString()}</Stat.ValueText>
              <Stat.HelpText>Across all grades</Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Body>
            <Stat.Root>
              <Stat.Label>Total Teachers</Stat.Label>
              <Stat.ValueText>{counts.teachers.toLocaleString()}</Stat.ValueText>
              <Stat.HelpText>Staff members</Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Body>
            <Stat.Root>
              <Stat.Label>Total Subjects</Stat.Label>
              <Stat.ValueText>{counts.subjects.toLocaleString()}</Stat.ValueText>
              <Stat.HelpText>Available curriculum</Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        <Card.Root>
          <Card.Body>
            <Heading size="md" mb={4}>Monthly Admissions</Heading>
            {studentAdmissions.datasets && studentAdmissions.datasets.length > 0 ? (
              <BarChart data={studentAdmissions} height={300} />
            ) : (
              <Center h={300}><Text color="gray.500">No data available</Text></Center>
            )}
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Body>
            <Heading size="md" mb={4}>Student Distribution by Gender</Heading>
            {genderDistribution.datasets && genderDistribution.datasets.length > 0 ? (
              <PieChart data={genderDistribution} height={300} />
            ) : (
              <Center h={300}><Text color="gray.500">No data available</Text></Center>
            )}
          </Card.Body>
        </Card.Root>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
