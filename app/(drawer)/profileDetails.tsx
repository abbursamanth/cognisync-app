import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../../firebase';

export default function ProfileDetails() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const profileRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(profileRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const hobbiesDisplay = profile?.hobbies
    ? typeof profile.hobbies === 'string'
      ? profile.hobbies
      : Array.isArray(profile.hobbies)
        ? profile.hobbies.join(', ')
        : 'N/A'
    : 'N/A';

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <>
          {/* Avatar Circle */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.username}>{profile?.name || 'Unnamed User'}</Text>
          </View>

          {/* Profile Sections */}
          <View style={styles.card}>
            <MaterialIcons name="email" size={20} color="#ccc" />
            <Text style={styles.cardText}>{auth.currentUser?.email || 'N/A'}</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="male-female" size={20} color="#ccc" />
            <Text style={styles.cardText}>Gender: {profile?.gender || 'N/A'}</Text>
          </View>

          <View style={styles.card}>
            <FontAwesome5 name="birthday-cake" size={18} color="#ccc" />
            <Text style={styles.cardText}>DOB: {profile?.dob || 'N/A'}</Text>
          </View>

          <View style={styles.card}>
            <MaterialIcons name="short-text" size={20} color="#ccc" />
            <Text style={styles.cardText}>Bio: {profile?.bio || 'N/A'}</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="sparkles" size={20} color="#ccc" />
            <Text style={styles.cardText}>Hobbies: {hobbiesDisplay}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#555',
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  username: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderColor: '#333',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 15,
    flexShrink: 1,
  },
});
