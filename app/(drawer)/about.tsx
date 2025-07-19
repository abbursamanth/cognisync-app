import React, { useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Platform, Dimensions, Animated } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useFonts } from 'expo-font';

const sections = {
  vision: {
    title: "VISION",
    content: "Cognisync envisions a future where your mind connects effortlessly with technology and enhancing how we live, work, and evolve through cognitive-driven systems."
  },
  mission: {
    title: "MISSION",
    content: "We're on a mission to make brain-computer interaction a natural extension of the mind by boosting focus, preventing cognitive fatigue, and transforming how we engage with technology."
  },
  ethos: {
    title: "ETHOS",
    content: "We don't just build BCI systems. We build cognitive tools that learn, adapt, and evolve with you by merging neuroscience, design, and intelligent software into one seamless experience."
  }
};

const teamMembers = [
  { name: 'D.Oviya', uri: require('../../assets/images/member1.jpg') },
  { name: 'T.Ruthu', uri: require('../../assets/images/member2.jpg') },
  { name: 'Dhanyashree.K', uri: require('../../assets/images/member3.jpg') },
];

const mentor = {
  name: 'MR. PAVAN M SRIVATSA',
  title: 'Psychologist & Psychoanalyst\nFounder Chakshu Foundation\nMentor & MD, Cognisync',
  quote: '"Anyatha sharanam nasthi, tvameva sharnam mama, tasmath karunya bhavena raksha raksha janardhana"',
  uri: require('../../assets/images/mentor.jpeg'),
};

type SectionKeys = 'vision' | 'mission' | 'ethos' | 'team' | 'mentor';

export default function About() {
  const { width } = Dimensions.get('window');
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  // Animation values for each section
  const fadeAnims: Record<SectionKeys, Animated.Value> = {
    vision: useRef(new Animated.Value(0)).current,
    mission: useRef(new Animated.Value(0)).current,
    ethos: useRef(new Animated.Value(0)).current,
    team: useRef(new Animated.Value(0)).current,
    mentor: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    // Sequence the animations
    const animateSequence = () => {
      Animated.stagger(400, [
        Animated.timing(fadeAnims.vision, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnims.mission, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnims.ethos, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnims.team, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnims.mentor, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    };

    animateSequence();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        {/* Vision, Mission, Ethos Sections */}
        {(Object.entries(sections) as [SectionKeys, typeof sections[keyof typeof sections]][]).map(([key, section]) => (
          <Animated.View 
            key={key} 
            style={[
              styles.section,
              { opacity: fadeAnims[key], transform: [{ translateY: fadeAnims[key].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })}] }
            ]}
          >
            <ThemedText style={[styles.sectionTitle, styles.rewireFont]}>{section.title}</ThemedText>
            <ThemedText style={styles.sectionContent}>{section.content}</ThemedText>
          </Animated.View>
        ))}

        {/* Team Section */}
        <Animated.View style={[
          styles.teamSection,
          { opacity: fadeAnims.team, transform: [{ translateY: fadeAnims.team.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })}] }
        ]}>
          <ThemedText style={[styles.teamTitle, styles.rewireFont]}>MEET OUR TEAM</ThemedText>
          <View style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamMember}>
                <Image source={member.uri} style={styles.teamImage} />
                <ThemedText style={styles.memberName}>{member.name}</ThemedText>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Mentor Section */}
        <Animated.View style={[
          styles.mentorSection,
          { opacity: fadeAnims.mentor, transform: [{ translateY: fadeAnims.mentor.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })}] }
        ]}>
          <ThemedText style={[styles.teamTitle, styles.rewireFont]}>MEET OUR MENTOR</ThemedText>
          <Image source={mentor.uri} style={styles.mentorImage} />
          <ThemedText style={[styles.mentorName, styles.rewireFont]}>{mentor.name}</ThemedText>
          <ThemedText style={styles.mentorTitle}>{mentor.title}</ThemedText>
          <ThemedText style={styles.mentorQuote}>{mentor.quote}</ThemedText>
        </Animated.View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  section: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  rewireFont: {
    fontFamily: 'SpaceMono',
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionContent: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '90%',
  },
  teamSection: {
    width: '100%',
    marginTop: 16,
    marginBottom: 30,
  },
  teamTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  teamMember: {
    alignItems: 'center',
    width: '28%',
  },
  teamImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  mentorSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  mentorImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 16,
  },
  mentorName: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  mentorTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  mentorQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
});

