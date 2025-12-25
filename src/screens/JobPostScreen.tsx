import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Services from "../Services/services";

type DropdownItem = {
    id?: string;
    name: string;
};

const JobPostScreen: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const [skills, setSkills] = useState<DropdownItem[]>([]);
    const [languages, setLanguages] = useState<DropdownItem[]>([]);
    const [currencies, setCurrencies] = useState<DropdownItem[]>([]);
    const [countries, setCountries] = useState<DropdownItem[]>([]);
    const [states, setStates] = useState<DropdownItem[]>([]);
    const [questions, setQuestions] = useState<string[]>([""]);

    const [jobLocation, setJobLocation] = useState<
        "REMOTE" | "HYBRID" | "ONSITE" | ""
    >("");

    const [jobVisibility, setJobVisibility] = useState<
        "EVERYONE" | "INVITED" | "ONLY_ME" | ""
    >("");


    const initialFormState = {
        jobTitle: "",
        experience: "",
        description: "",
        payRate: "",
        city: "",
        CompanyName: "",
        CompanyWebsite: "",
        skill: "",
        language: "",
        jobType: "",
        currency: "",
        country: "",
        state: "",
    };

    const [form, setForm] = useState(initialFormState);

    /** ---------- API CALLS ---------- */
    const addQuestion = () => {
        setQuestions(prev => [...prev, ""]);
    };

    const removeQuestion = (index: number) => {
        setQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const updateQuestion = (text: string, index: number) => {
        const updated = [...questions];
        updated[index] = text;
        setQuestions(updated);
    };


    const validateForm = () => {
        if (!form.jobTitle.trim()) return "Job title is required";
        if (!form.description.trim()) return "Job description is required";
        if (!form.experience) return "Experience level is required";

        if (!form.skill) return "Please select at least one skill";
        if (!form.language) return "Please select at least one language";

        if (!form.jobType) return "Job type is required";
        if (!form.payRate) return "Pay rate is required";
        if (!form.currency) return "Currency is required";

        if (!form.CompanyName.trim()) return "Company name is required";
        if (!form.CompanyWebsite.trim()) return "Company website is required";

        if (!form.country) return "Country is required";
        if (!form.state) return "State is required";
        if (!form.city.trim()) return "City is required";

        if (!jobLocation) return "Job location type is required";
        if (!jobVisibility) return "Job visibility is required";

        const filledQuestions = questions.filter(q => q.trim());
        if (filledQuestions.length < 1)
            return "Please add at least one screening question";

        return null;
    };

    useEffect(() => {
        loadInitialDropdowns();
    }, []);

    const loadInitialDropdowns = async () => {
        setLoading(true);

        const [
            skillRes,
            langRes,
            currencyRes,
            countryRes,
        ] = await Promise.all([
            Services.getSkillDropDownList({}),
            Services.getLanguagesList({}),
            Services.getCurrency(),
            Services.getCountryList({}),
        ]);
        console.log("langRes", langRes);
        console.log("countryRes", countryRes);


        if (skillRes.success) setSkills(skillRes.data || []);
        if (langRes.success) setLanguages(langRes.data || []);
        if (currencyRes.success) setCurrencies(currencyRes.data || []);
        if (countryRes.success) setCountries(countryRes.data || []);

        setLoading(false);
    };

    const onCountryChange = async (countryName: string) => {
        setForm(prev => ({ ...prev, country: countryName, state: "" }));
        setStates([]);

        const res = await Services.getCountryDetailsState(countryName);
        if (res.success) {
            setStates(res.data);
        }
    };

    /** ---------- UI ---------- */

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    const submitJobPost = async () => {
        const error = validateForm();
        if (error) {
            alert(error);
            return;
        }

        setLoading(true);

        const payload = {
            title: form.jobTitle,
            job_description: form.description,

            skills: [form.skill], 
            experience: null,
            experience_level: Number(form.experience),

            language: [form.language], 

            job_type: form.jobType === "FULL_TIME" ? 1
                : form.jobType === "PART_TIME" ? 2
                    : 3,

            pay_rate: Number(form.payRate),
            currency_code: form.currency,

            company_name: form.CompanyName,
            company_website: form.CompanyWebsite,

            company_country: countries.find(c => c.name === form.country)?.id,
            company_state: form.state,
            company_city: form.city,

            job_visibility:
                jobVisibility === "EVERYONE" ? 1 :
                    jobVisibility === "INVITED" ? 2 : 3,

            questions: questions
                .filter(q => q.trim())
                .map(q => ({ question: q })),

            is_active: true,
            show_job_pay_rate: true,
            is_company_site_link: true,

            job_location_type:
                jobLocation === "REMOTE" ? "Remote" :
                    jobLocation === "HYBRID" ? "Hybrid" : "Onsite",
        };

        console.log("JOB POST PAYLOAD 👉", payload);

        const res = await Services.jobPost(payload);

        setLoading(false);

        if (res.success) {
            setForm(initialFormState);
            setQuestions([""]);
            setJobLocation("");
            setJobVisibility("");
            alert("✅ Job posted successfully");
        } else {
            alert(res.error || "Failed to post job");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Tell us about your position or Job Post</Text>

            <Input
                label="Job Title *"
                value={form.jobTitle}
                onChangeText={v => setForm({ ...form, jobTitle: v })}
            />

            <Dropdown
                label="Skills *"
                value={form.skill}
                items={skills}
                labelKey="name"
                valueKey="id"
                onChange={(v) => setForm({ ...form, skill: v })}
            />


            <Input
                label="Experience Level (In Years) *"
                value={form.experience}
                keyboardType="numeric"
                onChangeText={v => setForm({ ...form, experience: v })}
            />

            <Dropdown
                label="Languages *"
                value={form.language}
                items={languages}
                labelKey="name"
                valueKey="id"
                onChange={(v) => setForm({ ...form, language: v })}
            />


            <Text style={styles.label}>Describe your job *</Text>
            <TextInput
                multiline
                numberOfLines={5}
                style={styles.textArea}
                placeholder="Job description"
                value={form.description}
                onChangeText={v => setForm({ ...form, description: v })}
            />

            <Text style={styles.section}>What does this Job Pay?</Text>

            <Dropdown
                label="Job Type *"
                value={form.jobType}
                items={[
                    { label: "Full Time", value: "FULL_TIME" },
                    { label: "Part Time", value: "PART_TIME" },
                    { label: "Contract", value: "CONTRACT" },
                ]}
                labelKey="label"
                valueKey="value"
                onChange={(v) => setForm({ ...form, jobType: v })}
            />


            <Dropdown
                label="Currency *"
                value={form.currency}
                items={currencies}
                labelKey="currency"
                valueKey="currency"
                onChange={(v) => setForm({ ...form, currency: v })}
            />


            <Input
                label="Pay Rate *"
                value={form.payRate}
                keyboardType="numeric"
                onChangeText={v => setForm({ ...form, payRate: v })}
            />

            <Text style={styles.section}>
                What Questions do you want to ask Candidates?
            </Text>

            <Text style={styles.helperText}>
                It’s recommended to ask at least three questions to ensure quality applications.
            </Text>

            {questions.map((q, index) => (
                <View key={index} style={styles.questionRow}>
                    <TextInput
                        style={styles.questionInput}
                        placeholder={`Question ${index + 1}`}
                        value={q}
                        onChangeText={(text) => updateQuestion(text, index)}
                    />

                    {questions.length > 1 && (
                        <TouchableOpacity onPress={() => removeQuestion(index)}>
                            <Text style={styles.deleteIcon}>🗑</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            <TouchableOpacity style={styles.addQuestionBtn} onPress={addQuestion}>
                <Text style={styles.addQuestionText}>+ Add Question</Text>
            </TouchableOpacity>



            <Text style={styles.section}>Tell us a little about your Company</Text>
            <Text style={styles.helperText}>It’s recommended to ask at least three questions in order to ensure you receive quality applications.
            </Text>
            <Text style={styles.label}>Company Name *</Text>
            <TextInput
                multiline
                numberOfLines={5}
                style={styles.textArea}
                placeholder="Company Name"
                value={form.CompanyName}
                onChangeText={v => setForm({ ...form, CompanyName: v })}
            />
            <Text style={styles.label2}> Company website *</Text>
            <TextInput
                multiline
                numberOfLines={5}
                style={styles.textArea2}
                placeholder="Company website"
                value={form.CompanyWebsite}
                onChangeText={v => setForm({ ...form, CompanyWebsite: v })}
            />

            <Dropdown
                label="Country *"
                value={form.country}
                items={countries}
                labelKey="name"
                valueKey="name"
                onChange={(countryName) => onCountryChange(countryName)}
            />

            <Dropdown
                label="State *"
                value={form.state}
                items={states}
                labelKey="name"
                valueKey="name"
                disabled={!states.length}
                onChange={(v) => setForm({ ...form, state: v })}
            />

            <Input
                label="City *"
                value={form.city}
                onChangeText={v => setForm({ ...form, city: v })}
            />

            <Text style={styles.section}>Job Location</Text>

            <View style={styles.radioGroup}>
                {[
                    { label: "Remote", value: "REMOTE" },
                    { label: "Hybrid", value: "HYBRID" },
                    { label: "On site", value: "ONSITE" },
                ].map(item => (
                    <TouchableOpacity
                        key={item.value}
                        style={styles.radioItem}
                        onPress={() => setJobLocation(item.value as any)}
                    >
                        <View
                            style={[
                                styles.radioCircle,
                                jobLocation === item.value && styles.radioSelected,
                            ]}
                        />
                        <Text>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>


            <Text style={styles.section}>Job Visibility</Text>

            <View style={styles.radioGroup}>
                {[
                    { label: "Everyone", value: "EVERYONE" },
                    { label: "Only invited users", value: "INVITED" },
                    { label: "Only me", value: "ONLY_ME" },
                ].map(item => (
                    <TouchableOpacity
                        key={item.value}
                        style={styles.radioItem}
                        onPress={() => setJobVisibility(item.value as any)}
                    >
                        <View
                            style={[
                                styles.radioCircle,
                                jobVisibility === item.value && styles.radioSelected,
                            ]}
                        />
                        <Text>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={styles.submitBtn}
                onPress={submitJobPost}
            >
                <Text style={styles.submitText}>
                    Post a Job for 60 Days (Free)
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

export default JobPostScreen;

/** ---------- REUSABLE COMPONENTS ---------- */

const Input = ({ label, ...props }: any) => (
    <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput style={styles.input} {...props} />
    </View>
);

type DropdownProps = {
    label: string;
    value: any;
    items: any[];
    onChange: (value: any) => void;
    labelKey: string;
    valueKey: string;
    disabled?: boolean;
};

const Dropdown = ({
    label,
    value,
    items,
    onChange,
    labelKey,
    valueKey,
    disabled,
}: DropdownProps) => (
    <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>

        <View style={[styles.pickerBox, disabled && { opacity: 0.5 }]}>
            <Picker
                enabled={!disabled}
                selectedValue={value}
                onValueChange={onChange}
            >
                <Picker.Item label="Select" value="" />

                {items.map((item, index) => (
                    <Picker.Item
                        key={index}
                        label={item[labelKey]?.toString() || ""}
                        value={item[valueKey]}
                    />
                ))}
            </Picker>
        </View>
    </View>
);


/** ---------- STYLES ---------- */

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 16,
    },
    section: {
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 16,
    },
    field: {
        marginBottom: 14,
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "500",
    },

    label2: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        padding: 12,
    },
    pickerBox: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
    },
    textArea: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        padding: 12,
        textAlignVertical: "top",
    },

    textArea2: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        padding: 12,
        textAlignVertical: "top",
        marginBottom: 10

    },
    submitBtn: {
        backgroundColor: "#0A2FFF",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 30,
    },
    submitText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    helperText: {
        color: "#666",
        fontSize: 13,
        marginBottom: 12,
    },

    questionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    questionInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        padding: 12,
    },

    deleteIcon: {
        fontSize: 18,
        color: "red",
        marginLeft: 10,
    },

    addQuestionBtn: {
        borderWidth: 1,
        borderColor: "#0A2FFF",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginTop: 6,
    },

    addQuestionText: {
        color: "#0A2FFF",
        fontWeight: "600",
    },

    radioGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
    },

    radioItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
        marginBottom: 10,
    },

    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#0A2FFF",
        marginRight: 8,
    },

    radioSelected: {
        backgroundColor: "#0A2FFF",
    },

});
