import StudentTile from './StudentTile';

interface Student {
  id: string;
  name: string;
  attentionScore?: number;
  status?: string;
}

interface Props {
  students: Student[];
  sessionId: string;
}

export default function StudentGrid({ students, sessionId }: Props) {
  const getGridClass = () => {
    const count = students.length;
    if (count === 0) return 'grid-cols-1';
    if (count === 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 9) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  if (students.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">👥</div>
        <p className="text-gray-400">Waiting for students to join...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-lg font-bold text-white mb-4">
        Students ({students.length})
      </h3>
      <div className={`grid ${getGridClass()} gap-4`}>
        {students.map((student) => (
          <StudentTile key={student.id} student={student} sessionId={sessionId} />
        ))}
      </div>
    </div>
  );
}
