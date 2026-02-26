import { Box, Grid, Heading, Stat, Card, Spinner, Center, Text, HStack, NativeSelect, Stack, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { studentService } from '../../service/studentService';
import { teacherService } from '../../service/teacherService';
import { subjectService } from '../../service/subjectService';
import { chartService } from '../../service/chartService';
import type { ChartData } from 'chart.js';
import { showErrorToast } from '../../util/toast.util';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    subjects: 0
  });

  const [genderByGradeData, setGenderByGradeData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: []
  });

  const [averageMarksData, setAverageMarksData] = useState<ChartData<'pie'>>({
    labels: [],
    datasets: []
  });
  
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedDivision, setSelectedDivision] = useState<string>("A");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentRes, teacherRes, subjectRes, genderRes] = await Promise.all([
          studentService.getAllStudents(1, 1),
          teacherService.getAllTeachers(1, 1),
          subjectService.getAllSubjects(1, 1),
          chartService.listGenderByGrade()
        ]);

        setCounts({
          students: studentRes.data?.totalCount || 0,
          teachers: teacherRes.data?.totalCount || 0,
          subjects: subjectRes.data?.totalCount || 0
        });

        const genderByGradeRaw = genderRes.data || [];
        
        if (genderByGradeRaw.length > 0) {
          setGenderByGradeData({
            labels: genderByGradeRaw.map((item: any) => `Grade ${item.grade}`),
            datasets: [
              {
                label: 'Male',
                data: genderByGradeRaw.map((item: any) => parseInt(item.MALE)),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
              {
                label: 'Female',
                data: genderByGradeRaw.map((item: any) => parseInt(item.FEMALE)),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              }
            ]
          });
        }

      } catch (error) {
        showErrorToast("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Effect to fetch average marks when grade or division changes
  useEffect(() => {
    const fetchAvgMarks = async () => {
      try {
        const avgMarksRes = await chartService.calculateAverageMarks({ 
          grade: selectedGrade, 
          division: selectedDivision 
        });
        const avgMarksRaw = avgMarksRes.data || [];
        
        if (avgMarksRaw.length > 0) {
          setAverageMarksData({
            labels: avgMarksRaw.map((item: any) => item.subject),
            datasets: [
              {
                label: 'Average Marks',
                data: avgMarksRaw.map((item: any) => item.average),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(54, 162, 235, 0.5)',
                  'rgba(255, 206, 86, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                  'rgba(153, 102, 255, 0.5)',
                  'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              }
            ]
          });
        } else {
          setAverageMarksData({ labels: [], datasets: [] });
        }
      } catch (error) {
        showErrorToast("Failed to fetch average marks data");
      }
    };

    fetchAvgMarks();
  }, [selectedGrade, selectedDivision]);

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
            <Heading size="md" mb={4}>Gender Distribution by Grade</Heading>
            {genderByGradeData.datasets && genderByGradeData.datasets.length > 0 ? (
              <BarChart data={genderByGradeData} height={300} />
            ) : (
              <Center h={300}><Text color="gray.500">No data available</Text></Center>
            )}
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Body>
            <Stack gap={4}>
              <HStack justify="space-between" align="center">
                <Heading size="md">Average Marks by Subject</Heading>
                <HStack gap={2}>
                  <NativeSelect.Root width="100px" size="sm">
                    <NativeSelect.Field 
                      value={selectedGrade} 
                      onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                        <option key={g} value={g}>Grade {g}</option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  <NativeSelect.Root width="100px" size="sm">
                    <NativeSelect.Field 
                      value={selectedDivision} 
                      onChange={(e) => setSelectedDivision(e.target.value)}
                    >
                      {['A', 'B', 'C', 'D'].map(d => (
                        <option key={d} value={d}>Div {d}</option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </HStack>
              </HStack>
              
              {averageMarksData.datasets && averageMarksData.datasets.length > 0 ? (
                <PieChart data={averageMarksData} height={300} />
              ) : (
                <Center h={300}>
                  <VStack>
                    <Text color="gray.500">No data available</Text>
                    <Text fontSize="xs" color="gray.400">for Grade {selectedGrade} - Div {selectedDivision}</Text>
                  </VStack>
                </Center>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
